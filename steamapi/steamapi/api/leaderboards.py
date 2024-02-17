import asyncio

from quart import Blueprint, request
from httpx import AsyncClient
from ..broker.utils import get_redis_result, ping_broker
from ..broker.types import RedisMessage, RedisMessageType
from ..api.users import get_owned_games, get_friend_list
from ..api.utils import set_payload_from_requests
from ..api.types import DEFAULT_API_CLIENT_LIMITS
from ..api.user_stats import (
    get_achievement_score,
    get_user_library_value,
)

api = Blueprint("leaderboards", __name__, url_prefix="/compute/stats/leaderboards")

api.before_request(ping_broker())


@api.route("friends/<userid>/gamerscore", methods=["GET"])
async def get_friends_achievement_score_leaderboard(userid):
    async def set_callback(message: RedisMessage, requests):
        for completed in asyncio.as_completed(requests):
            result = await completed
            message.payload.update({result["data"]["steamid"]: result["data"]["score"]})

    message = RedisMessage(
        request.args.get("key"), RedisMessageType.LEADERBOARD_ACHIEVEMENTS_SCORE.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        friendlist = await get_friend_list(
            userid, key=request.args.get("key"), session=session
        )
        requests = [
            get_achievement_score(
                friend["steamid"], key=request.args.get("key"), session=session
            )
            for friend in friendlist["friends"]
        ]

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
        )

    # publish message to Redis
    return await get_redis_result(
        message,
        f"computed{RedisMessageType.LEADERBOARD_ACHIEVEMENTS_SCORE.value}_{request.args.get('token')}",
    )  # add channel to kwargs when implementing auth


@api.route("friends/<userid>/playtime", methods=["GET"])
async def get_friends_playtime_leaderboard(userid):
    async def set_callback(message: RedisMessage, requests):
        for completed in asyncio.as_completed(requests):
            result = await completed
            message.payload.update(
                {result["data"]["steamid"]: result["data"]["playtime"]}
            )

    message = RedisMessage(
        request.args.get("key"), RedisMessageType.LEADERBOARD_PLAYTIME.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        friendlist = await get_friend_list(
            userid, key=request.args.get("key"), session=session
        )

        requests = [
            get_owned_games(
                friend["steamid"],
                key=request.args.get("key"),
                include_played_free_games=1,
                session=session,
            )
            for friend in friendlist["friends"]
        ]

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
        )
    # publish message to Redis
    return await get_redis_result(
        message,
        f"computed{RedisMessageType.LEADERBOARD_PLAYTIME.value}_{request.args.get('key')}",
    )  # add channel to kwargs when implementing auth


@api.route("friends/<userid>/value", methods=["GET"])
async def get_friends_library_value_leaderboard(userid):
    message = RedisMessage(
        request.args.get("key"), RedisMessageType.LEADERBOARD_LIBRARY_VALUE.value
    )

    async def set_callback(message: RedisMessage, requests):
        for completed in asyncio.as_completed(requests):
            result = await completed
            message.payload.update({result["data"]["steamid"]: result["data"]["value"]})

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        friendlist = await get_friend_list(
            userid, key=request.args.get("key"), session=session
        )
        requests = [
            get_user_library_value(
                friend["steamid"], key=request.args.get("key"), session=session
            )
            for friend in friendlist["friends"]
        ]

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
        )

    # publish message to Redis
    return await get_redis_result(
        message,
        f"computed{RedisMessageType.LEADERBOARD_LIBRARY_VALUE.value}_{request.args.get('key')}",
    )  # add channel to kwargs when implementing auth


@api.route("friends/<userid>/versatility", methods=["GET"])
async def get_friends_versatility_score_leaderboard(userid):
    async def set_callback(message: RedisMessage, requests):
        for completed in asyncio.as_completed(requests):
            result = await completed
            message.payload.update({result["data"]["steamid"], result["data"]["score"]})

    message = RedisMessage(
        request.args.get("key"), RedisMessageType.LEADERBOARD_VERSATILITY_SCORE.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        friendlist = await get_friend_list(
            userid, key=request.args.get("key"), session=session
        )
        requests = [
            get_owned_games(
                friend["steamid"],
                key=request.args.get("key"),
                include_played_free_games=1,
                session=session,
            )
            for friend in friendlist["friends"]
        ]

        await set_payload_from_requests(
            message,
            requests,
            DEFAULT_API_CLIENT_LIMITS.max_connections,
            set_callback,
        )
    # publish message to Redis
    return await get_redis_result(
        message,
        f"computed{RedisMessageType.LEADERBOARD_VERSATILITY_SCORE.value}_{request.args.get('key')}",
    )  # add channel to kwargs when implementing auth
