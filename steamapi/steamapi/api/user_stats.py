import asyncio
import dataclasses
from sys import stderr
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
        custom_req_data={"userid": userid},
    )
    if owned.get("success") is not True:
        return owned
    message.payload.update({"steamid": userid, "games": dict()})
    requests = [
        get_player_achievements(
            userid,
            key=request.args.get("key"),
            appid=game,
            session=client,
            custom_req_data={"appid": game},
        )
        for game in owned["data"]
    ]

    message = await set_payload_from_requests(message, requests, set_callback)

    print("Sending request", file=stderr)
    # publish message to Redis
    reqid = await send_request(message)
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(response)


@api.route("<userid>/favorite", methods=["GET"])
@broker.ping()
async def get_user_favorite_genres_categories(userid):
    async def set_callback(message: RedisMessage, requests, owned: dict):
        responses = await asyncio.gather(*requests)
        for res in responses:
            if len(res["errors"]):
                print(res["errors"], file=stderr)
                continue
            print("DATA", res["data"], file=stderr)
            for appid, details in res["data"].items():
                if (
                    not details
                    or not details.get("genres")
                    or not details.get("categories")
                ):
                    continue
                if owned.get(appid) is None and owned.get(int(appid)) is None:
                    print("MISSING APP FROM LIBRARY", appid, file=stderr)
                    continue
                print("APPID", appid, "DETAILS", details, file=stderr)
                game = owned.get(appid) or owned.get(int(appid))
                message.payload.update(
                    {
                        appid: {
                            "genres": details["genres"],
                            "categories": details["categories"],
                            "playtime": game["playtime_forever"],
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
            custom_req_data={"userid": userid},
        )
        if owned.get("success") is not True:
            return owned
        requests = [
            get_app_details(game, session=session, custom_req_data={"appid": game})
            for game in owned["data"]
        ]

        print("BEFORE", message.payload, file=stderr)
        message = await set_payload_from_requests(
            message,
            requests,
            set_callback,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            owned["data"],
        )
        print("AFTER", message.payload, file=stderr)
        print("Sending request", file=stderr)
        # publish message to Redis

        reqid = await send_request(message)
        print("Request sent with id ", reqid, file=stderr)

        response = await get_response(userid)

        return dataclasses.asdict(response)


@api.route("<userid>/forgotten", methods=["GET"])
@broker.ping()
async def get_user_forgotten_games(userid):
    message = RedisMessage(RedisMessageType.USER_FORGOTTEN_GAMES.value, userid)

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        owned = await get_owned_games(
            userid,
            key=request.args.get("key"),
            include_appinfo=1,
            session=session,
            custom_req_data={"userid": userid},
        )
        if owned.get("success") is not True:
            return owned

        for game, data in owned["data"].items():
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
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)
    return dataclasses.asdict(response)
