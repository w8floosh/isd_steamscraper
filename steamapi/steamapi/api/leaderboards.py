import json
from steamapi.broker.redis import broker
from steamapi.api.users import get_owned_games, get_friend_list
from steamapi.api.store import get_app_details
from steamapi.broker.utils import get_redis_result
from steamapi.broker.types import RedisMessage, RedisMessageTypes
from quart import Blueprint, request

api = Blueprint("leaderboards", __name__, url_prefix="/compute/stats/leaderboards")


@api.route("friends/<userid>/gamerscore", methods=["GET"])
async def get_friends_achievement_score_leaderboard(userid):
    message = RedisMessage(
        request.args.get("key"), RedisMessageTypes.LEADERBOARD_ACHIEVEMENTS_SCORE.value
    )
    response = await get_friend_list(userid, key=request.args.get("key"))
    friends = response.friendslist.friends
    steamids = [friend.steamid for friend in friends]
    message.payload_set(userid, steamids)

    # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth


@api.route("friends/<userid>/playtime", methods=["GET"])
async def get_friends_playtime_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_PLAYTIME.value)

    friends = json.loads((await get_friend_list(userid)).data).friendslist.friends

    for friend in friends:
        owned = json.loads(
            await get_owned_games(
                friend.steamid, key=request.args.get("key"), include_played_free_games=1
            )
        )
        message.payload_set(id, owned.response.games)

    # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth


@api.route("friends/<userid>/value", methods=["GET"])
async def get_friends_library_value_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_LIBRARY_VALUE.value)

    friends = json.loads((await get_friend_list(userid)).data).friendslist.friends

    for friend in friends:
        owned = json.loads(
            await get_owned_games(friend.steamid, key=request.args.get("key"))
        )
        game_ids = ",".join([game.appid for game in owned.response.games])

        price_mapping = dict()

        detailed_apps = json.loads(
            await get_app_details(game_ids, filters="price_overview")
        )

        for game, details in detailed_apps:
            price_mapping.update({game: details.price_overview.final})

        message.payload_set(friend.steamid, price_mapping)

    # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth


@api.route("friends/<userid>/versatility", methods=["GET"])
async def get_friends_versatility_score_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_VERSATILITY_SCORE.value)

    friends = json.loads((await get_friend_list(userid)).data).friendslist.friends

    for friend in friends:
        owned = json.loads(
            await get_owned_games(
                friend.steamid, key=request.args.get("key"), include_played_free_games=1
            )
        )
        message.payload_set(friend.steamid, owned.response.games)

    # publish message to Redis
    return await get_redis_result(
        broker,
        message,
        request.args.get("key"),
    )  # add channel to kwargs when implementing auth
