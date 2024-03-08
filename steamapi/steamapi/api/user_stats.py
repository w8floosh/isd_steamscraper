import asyncio
import dataclasses
from sys import stderr
from aspectlib import weave
from quart import Blueprint, request
from httpx import AsyncClient


from ..broker import broker
from ..broker.types import (
    RedisMessageType,
    RedisMessage,
)
from ..broker.utils import send_request, get_response
from ..api.types import DEFAULT_API_CLIENT_LIMITS
from ..api.stats import get_player_achievements
from ..api.store import get_app_details
from ..api.users import get_owned_games
from ..api.utils import (
    clean_obj,
    set_payload_from_requests,
)


api = Blueprint("playerstats", __name__, url_prefix="/compute/stats/players")


@api.route("<userid>/gamerscore", methods=["GET"])
@broker.ping()
# @cached(
#     RedisCacheKeyPattern.COMPUTED_DATA,
#     RedisMessageType.USER_ACHIEVEMENTS_SCORE.value,
#     ttl=RedisCacheTTL.LONGEST,
# )
async def get_achievement_score(userid, **kwargs):
    async def set_callback(message: RedisMessage, requests):
        responses = await asyncio.gather(*requests)
        for result in responses:
            data: dict = result.get("data")
            if data:
                key = list(data.keys())[0]
                message.payload["games"].update({key: data.pop(key)})

    message = RedisMessage(RedisMessageType.USER_ACHIEVEMENTS_SCORE.value, userid)

    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS)
    owned = await get_owned_games(
        userid,
        key=request.args.get("key"),
        include_played_free_games=1,
        session=client,
    )
    message.payload.update({"steamid": owned["data"]["steamid"], "games": dict()})
    requests = [
        get_player_achievements(
            userid,
            key=request.args.get("key"),
            appid=game,
            session=client,
        )
        for game in owned["data"]["games"]
    ]

    await set_payload_from_requests(message, requests, set_callback)

    print("Sending request", file=stderr)
    # publish message to Redis
    reqid = await send_request(message)
    # add channel to kwargs when implementing auth
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(response)


@api.route("<userid>/favorite", methods=["GET"])
@broker.ping()
# @cached(
#     RedisCacheKeyPattern.COMPUTED_DATA,
#     RedisMessageType.USER_FAVORITE_GENRES_CATEGORIES.value,
#     ttl=RedisCacheTTL.LONGEST,
# )
async def get_user_favorite_genres_categories(userid):
    async def set_callback(message: RedisMessage, requests, owned):
        responses = await asyncio.gather(*requests)
        for res in responses:
            if len(res["errors"]):
                continue
            for appid, details in res["data"].items():
                message.payload.update(
                    {
                        appid: {
                            "genres": details["genres"],
                            "categories": details["categories"],
                            "playtime": owned.get(int(appid))["playtime_forever"],
                        }
                    }
                )

    message = RedisMessage(
        RedisMessageType.USER_FAVORITE_GENRES_CATEGORIES.value, userid
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        owned = await get_owned_games(
            userid,
            key=request.args.get("key"),
            include_played_free_games=1,
            session=session,
        )

        requests = [
            get_app_details(game, session=session) for game in owned["data"]["games"]
        ]

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
            owned["data"]["games"],
        )

        print("Sending request", file=stderr)
        # publish message to Redis
        reqid = await send_request(message)
        # add channel to kwargs when implementing auth
        print("Request sent with id ", reqid, file=stderr)

        response = await get_response(userid)

        # publish message to Redis
        return dataclasses.asdict(response)
        # add channel to kwargs when implementing auth


# @api.route("<userid>/value", methods=["GET"])
# # @cached(
# #     RedisCacheKeyPattern.COMPUTED_DATA,
# #     RedisMessageType.USER_LIBRARY_VALUE.value,
# #     ttl=RedisCacheTTL.LONGEST,
# # )
# async def get_user_library_value(userid):
#     message = RedisMessage(
#         RedisMessageType.USER_LIBRARY_VALUE.value, userid
#     )

#     async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
#         owned = await get_owned_games(
#             userid, key=request.args.get("key"), session=session
#         )

#         requests = [
#             get_app_details(game["appid"], filters="price_overview", session=session)
#             for game in owned
#         ]

#         async def set_callback(message: RedisMessage, requests):
#             for completed in asyncio.as_completed(requests):
#                 result = await completed
#                 message.payload.update(
#                     result["appid"], result["price_overview"]["final"]
#                 )

#         await set_payload_from_requests(
#             message,
#             requests,
#             DEFAULT_API_CLIENT_LIMITS.max_connections,
#             set_callback,
#         )
#         # publish message to Redis
#     return dataclasses.asdict(
#         await get_redis_result(
#             message,
#             f"computed{RedisMessageType.USER_LIBRARY_VALUE.value}_{request.args.get('key')}",
#         )
#     )  # add channel to kwargs when implementing auth


@api.route("<userid>/forgotten", methods=["GET"])
@broker.ping()
# @cached(
#     RedisCacheKeyPattern.COMPUTED_DATA,
#     RedisMessageType.USER_FORGOTTEN_GAMES.value,
#     ttl=RedisCacheTTL.LONGEST,
# )
async def get_user_forgotten_games(userid):
    message = RedisMessage(RedisMessageType.USER_FORGOTTEN_GAMES.value, userid)

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        owned = await get_owned_games(
            userid, key=request.args.get("key"), include_appinfo=1, session=session
        )

        for game, data in owned["data"]["games"].items():
            message.payload.update(
                {
                    game: clean_obj(
                        data, entries=["name", "playtime_forever", "rtime_last_played"]
                    ),
                }
            )

    print("Sending request", file=stderr)
    # publish message to Redis
    reqid = await send_request(message)
    # add channel to kwargs when implementing auth
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)
    # publish message to Redis
    return dataclasses.asdict(response)


# add channel to kwargs when implementing auth
