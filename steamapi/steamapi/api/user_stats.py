import json, asyncio
from math import ceil
from aiofiles import stderr
from quart import Blueprint, request
from httpx import AsyncClient

from steamapi.broker.redis import broker
from steamapi.broker.types import RedisMessageTypes, RedisMessage
from steamapi.broker.utils import get_redis_result
from steamapi.api.types import DEFAULT_API_CLIENT_LIMITS
from steamapi.api.stats import get_game_user_stats
from steamapi.api.store import get_app_details
from steamapi.api.users import get_owned_games


api = Blueprint("playerstats", __name__, url_prefix="/compute/stats/players")


@api.route("<userid>/gamerscore", methods=["GET"])
async def get_achievement_score(userid):
    message = RedisMessage(
        request.args.get("key"), RedisMessageTypes.USER_ACHIEVEMENTS_SCORE.value
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        owned = await get_owned_games(
            userid,
            key=request.args.get("key"),
            include_played_free_games=1,
            session=session,
        )
        requests = [
            get_game_user_stats(
                userid,
                key=request.args.get("key"),
                appid=game["appid"],
                session=session,
            )
            for game in owned["response"]["games"]
        ]

        batch_size = DEFAULT_API_CLIENT_LIMITS.max_connections
        nreq = len(requests)
        for batch in range(ceil(nreq / batch_size)):
            batch_first = batch * batch_size
            batch_last = min((batch + 1) * batch_size, nreq)
            for completed in asyncio.as_completed(requests[batch_first:batch_last]):
                result = await completed
                message.payload_set(
                    result["appid"],
                    result,
                    "playerstats",
                    "achievements",
                )

        print(message, file=stderr)
        # publish message to Redis
        return await get_redis_result(
            broker,
            message,
            request.args.get("key"),
        )  # add channel to kwargs when implementing auth


@api.route("<userid>/favorite", methods=["GET"])
async def get_user_favorite_genres_categories(userid):
    message = RedisMessage(RedisMessageTypes.USER_FAVORITE_GENRES_CATEGORIES.value)
    owned = await get_owned_games(
        userid, key=request.args.get("key"), include_played_free_games=1
    )

    for game in owned["response"]["games"]:
        details = await get_app_details(game.appid)
        message.payload_set(
            game.appid,
            {
                "genres": details.genres,
                "categories": details.categories,
                "playtime": game.playtime_forever,
            },
        )

    # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth


@api.route("<userid>/value", methods=["GET"])
async def get_user_library_value(userid):
    message = RedisMessage(RedisMessageTypes.USER_LIBRARY_VALUE.value)
    owned = await get_owned_games(userid, key=request.args.get("key"))

    game_ids = ",".join([game.appid for game in json.loads(owned.data).response.games])
    details = await get_app_details(game_ids, filters="price_overview")

    for appid, price_overview in json.loads(details.data).items():
        message.payload_set(appid, price_overview.final)

        # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth


@api.route("<userid>/forgotten", methods=["GET"])
async def get_user_forgotten_games(userid):
    message = RedisMessage(RedisMessageTypes.USER_FORGOTTEN_GAMES.value)
    owned = await get_owned_games(
        userid, key=request.args.get("key"), include_appinfo=1
    )

    for game in json.loads(owned.data).response.games:
        message.payload_set(game.appid, game)

        # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth
