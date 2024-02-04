from flask import Blueprint, request
import requests
from ..utils import SteamWebAPI, check_response

api = Blueprint("stats", __name__, url_prefix="/stats")
_players = Blueprint("players", __name__, url_prefix="/players")
_apps = Blueprint("apps", __name__, url_prefix="/apps")


@_apps.route("/<id>", methods=["GET"])
def get_game_stats(id):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.value,
                "GetGlobalStatsForGame",
                "0002",
                request.args.get("key"),
                appid=id,
                count=request.args.get("count"),
                name=request.args.get("name"),
            )
        )
    )


@_apps.route("/<id>/achievements", methods=["GET"])
def get_app_global_achievement_percentages(id):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.value,
                "GetGlobalAchievementPercentagesForApp",
                "0002",
                request.args.get("key"),
                gameid=id,
            )
        )
    )


@_apps.route("/<id>/current", methods=["GET"])
def get_no_current_players(id):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.value,
                "GetNumberOfCurrentPlayers",
                "0001",
                request.args.get("key"),
                appid=id,
            )
        )
    )


@_players.route("/<player>", methods=["GET"])
def get_game_user_stats(player, **kwargs):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.value,
                "GetUserStatsForGame",
                "0002",
                request.args.get("key", kwargs.get("key")),
                steamid=player,
                appid=request.args.get("appid", kwargs.get("appid", "10")),
                l=request.args.get("l", kwargs.get("l", "english")),
            )
        )
    )


@_players.route("<player>/achievements", methods=["GET"])
def get_player_achievements(player):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.name,
                "GetPlayerAchievements",
                "0001",
                request.args.get("key"),
                steamid=player,
                appid=request.args.get("appid", "10"),
                l=request.args.get("l", "english"),
            )
        )
    )


api.register_blueprint(_players)
api.register_blueprint(_apps)
