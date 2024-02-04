import json
from ..api.users import get_owned_games, get_single_game_playtime, get_friend_list
from ..api.stats import get_game_user_stats
from ..api.store import get_app_details
from ..utils import RedisMessage, RedisMessageTypes
from flask import Blueprint, request

# Number & percentage of obtained achievements in the whole game library of the user
api = Blueprint("leaderboards", __name__, url_prefix="/compute/stats/leaderboards")


@api.route("friends/<userid>/gamerscore", methods=["GET"])
def get_friends_achievement_score_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_ACHIEVEMENTS_SCORE.value)

    friends = json.loads(get_friend_list(userid)).friendslist.friends
    steamids = [friend.steamid for friend in friends]
    message.payload_set(userid, steamids)

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result


@api.route("friends/<userid>/playtime", methods=["GET"])
def get_friends_playtime_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_PLAYTIME.value)

    friends = json.loads(get_friend_list(userid)).friendslist.friends

    for friend in friends:
        owned = json.loads(
            get_owned_games(
                friend.steamid, key=request.args.get("key"), include_played_free_games=1
            )
        )
        message.payload_set(id, owned.response.games)

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result


@api.route("friends/<userid>/value", methods=["GET"])
def get_friends_library_value_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_LIBRARY_VALUE.value)

    friends = json.loads(get_friend_list(userid)).friendslist.friends

    for friend in friends:
        owned = json.loads(get_owned_games(friend.steamid, key=request.args.get("key")))
        game_ids = ",".join([game.appid for game in owned.response.games])

        price_mapping = dict()

        detailed_apps = json.loads(get_app_details(game_ids, filters="price_overview"))

        for game, details in detailed_apps:
            price_mapping.update({game: details.price_overview.final})

        message.payload_set(friend.steamid, price_mapping)

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result


@api.route("friends/<userid>/versatility", methods=["GET"])
def get_friends_versatility_score_leaderboard(userid):
    message = RedisMessage(RedisMessageTypes.LEADERBOARD_VERSATILITY_SCORE.value)

    friends = json.loads(get_friend_list(userid)).friendslist.friends

    for friend in friends:
        owned = json.loads(
            get_owned_games(
                friend.steamid, key=request.args.get("key"), include_played_free_games=1
            )
        )
        message.payload_set(friend.steamid, owned.response.games)

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result
