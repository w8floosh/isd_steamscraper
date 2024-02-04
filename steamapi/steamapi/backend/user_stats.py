import json
from ..api.users import get_owned_games, get_single_game_playtime
from ..api.stats import get_game_user_stats
from ..api.store import get_app_details
from ..utils import RedisMessage, RedisMessageTypes
from flask import Blueprint, request

# Number & percentage of obtained achievements in the whole game library of the user
api = Blueprint("playerstats", __name__, url_prefix="/compute/stats/players")


@api.route("<userid>/gamerscore", methods=["GET"])
def get_achievement_score(userid):
    message = RedisMessage(RedisMessageTypes.USER_ACHIEVEMENTS_SCORE.value)

    owned = get_owned_games(
        userid, key=request.args.get("key"), include_played_free_games=1
    )

    for game in json.loads(owned.data).response.games:
        message.payload_set(
            game.appid, get_game_user_stats(userid, appid=game.appid).achievements
        )

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result


@api.route("<userid>/favorite", methods=["GET"])
def get_user_favorite_genres_categories(userid):
    message = RedisMessage(RedisMessageTypes.USER_FAVORITE_GENRES_CATEGORIES.value)
    owned = get_owned_games(
        userid, key=request.args.get("key"), include_played_free_games=1
    )

    for game in json.loads(owned.data).response.games:
        details = json.loads(get_app_details(game.appid).data)
        message.payload_set(
            game.appid,
            {
                "genres": details.genres,
                "categories": details.categories,
                "playtime": game.playtime_forever,
            },
        )

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result


@api.route("<userid>/value", methods=["GET"])
def get_user_library_value(userid):
    message = RedisMessage(RedisMessageTypes.USER_LIBRARY_VALUE.value)
    owned = get_owned_games(userid, key=request.args.get("key"))

    game_ids = ",".join([game.appid for game in json.loads(owned.data).response.games])
    details = get_app_details(game_ids, filters="price_overview")

    for appid, price_overview in json.loads(details.data).items():
        message.payload_set(appid, price_overview.final)

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result


@api.route("<userid>/forgotten", methods=["GET"])
def get_user_forgotten_games(userid):
    message = RedisMessage(RedisMessageTypes.USER_FORGOTTEN_GAMES.value)
    owned = get_owned_games(userid, key=request.args.get("key"), include_appinfo=1)

    for game in json.loads(owned.data).response.games:
        message.payload_set(game.appid, game)

    # publish message to Redis
    # redisclient.publish("calc_req", message)

    # consume result
    # result = redisclient.consume("calc_res")

    # return result
