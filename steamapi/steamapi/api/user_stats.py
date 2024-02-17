import asyncio
import dataclasses
from sys import stderr
from quart import Blueprint, request
from httpx import AsyncClient

from ..broker.types import (
    RedisMessageType,
    RedisMessage,
    RedisCacheKeyPattern,
    RedisCacheTTL,
)
from ..broker.utils import get_redis_result, cached, ping_broker
from ..api.types import DEFAULT_API_CLIENT_LIMITS
from ..api.stats import get_player_achievements
from ..api.store import get_app_details
from ..api.users import get_owned_games
from ..api.utils import (
    set_payload_from_requests,
)


api = Blueprint("playerstats", __name__, url_prefix="/compute/stats/players")


@api.route("<userid>/gamerscore", methods=["GET"])
@cached(
    RedisCacheKeyPattern.COMPUTED_DATA,
    RedisMessageType.USER_ACHIEVEMENTS_SCORE.value,
    ttl=RedisCacheTTL.LONGEST,
)
async def get_achievement_score(userid, **kwargs):
    async def set_callback(message: RedisMessage, requests):
        for completed in asyncio.as_completed(requests):
            result = await completed
            message.payload.update(result["appid"], result)

    message = RedisMessage(
        request.args.get("key"), RedisMessageType.USER_ACHIEVEMENTS_SCORE.value
    )

    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS)
    owned = await get_owned_games(
        userid,
        key=request.args.get("key"),
        include_played_free_games=1,
        session=client,
    )
    requests = [
        get_player_achievements(
            userid,
            key=request.args.get("key"),
            appid=game["appid"],
            session=client,
        )
        for game in owned
    ]

    await set_payload_from_requests(
        message, requests, DEFAULT_API_CLIENT_LIMITS.max_connections, set_callback
    )

    print("Sending message: ", message, file=stderr)
    # publish message to Redis
    result = await get_redis_result(
        message,
        f"computed{RedisMessageType.USER_ACHIEVEMENTS_SCORE.value}_{request.args.get('key')}",
    )  # add channel to kwargs when implementing auth

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)


@api.route("<userid>/favorite", methods=["GET"])
@cached(
    RedisCacheKeyPattern.COMPUTED_DATA,
    RedisMessageType.USER_FAVORITE_GENRES_CATEGORIES.value,
    ttl=RedisCacheTTL.LONGEST,
)
async def get_user_favorite_genres_categories(userid):
    message = RedisMessage(
        request.args.get("key"), RedisMessageType.USER_FAVORITE_GENRES_CATEGORIES.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:

        owned = await get_owned_games(
            userid,
            key=request.args.get("key"),
            include_played_free_games=1,
            session=session,
        )

        requests = [get_app_details(game["appid"], session=session) for game in owned]

        async def set_callback(message: RedisMessage, requests, owned):
            for completed in asyncio.as_completed(requests):
                result = await completed
                message.payload.update(
                    result["appid"],
                    {
                        "genres": result["data"]["details"]["genres"],
                        "categories": result["data"]["details"]["categories"],
                        "playtime": next(
                            (
                                game
                                for game in owned
                                if game["appid"] == result["appid"]
                            ),
                            None,
                        ),
                    },
                )

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
            owned,
        )

        # publish message to Redis
        return dataclasses.asdict(
            await get_redis_result(
                message,
                f"computed{RedisMessageType.USER_FAVORITE_GENRES_CATEGORIES.value}_{request.args.get('key')}",
            )
        )  # add channel to kwargs when implementing auth


@api.route("<userid>/value", methods=["GET"])
@cached(
    RedisCacheKeyPattern.COMPUTED_DATA,
    RedisMessageType.USER_LIBRARY_VALUE.value,
    ttl=RedisCacheTTL.LONGEST,
)
async def get_user_library_value(userid):
    message = RedisMessage(
        request.args.get("key"), RedisMessageType.USER_LIBRARY_VALUE.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        owned = await get_owned_games(
            userid, key=request.args.get("key"), session=session
        )

        requests = [
            get_app_details(game["appid"], filters="price_overview", session=session)
            for game in owned
        ]

        async def set_callback(message: RedisMessage, requests):
            for completed in asyncio.as_completed(requests):
                result = await completed
                message.payload.update(
                    result["appid"], result["price_overview"]["final"]
                )

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
        )
        # publish message to Redis
    return dataclasses.asdict(
        await get_redis_result(
            message,
            f"computed{RedisMessageType.USER_LIBRARY_VALUE.value}_{request.args.get('key')}",
        )
    )  # add channel to kwargs when implementing auth


@api.route("<userid>/forgotten", methods=["GET"])
@cached(
    RedisCacheKeyPattern.COMPUTED_DATA,
    RedisMessageType.USER_FORGOTTEN_GAMES.value,
    ttl=RedisCacheTTL.LONGEST,
)
async def get_user_forgotten_games(userid):
    message = RedisMessage(
        request.args.get("key"), RedisMessageType.USER_FORGOTTEN_GAMES.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        owned = await get_owned_games(
            userid, key=request.args.get("key"), include_appinfo=1, session=session
        )

        for game in owned:
            message.payload.update(game["appid"], game)

        # publish message to Redis
    return dataclasses.asdict(
        await get_redis_result(
            message,
            f"computed{RedisMessageType.USER_FORGOTTEN_GAMES.value}_{request.args.get('key')}",
        )
    )  # add channel to kwargs when implementing auth
