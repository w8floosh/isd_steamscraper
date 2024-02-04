from flask import Blueprint, request
import requests
from ..utils import SteamWebAPI, SteamworksAPI, check_response

# from ..backend.userstats import backend

api = Blueprint("users", __name__, url_prefix="/users")


@api.route("/", methods=["GET"])
def get_player_summaries():
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.USER.value,
                "GetPlayerSummaries",
                "0002",
                request.args.get("key"),
                steamids=request.args.get("steamids"),
            )
        )
    )


@api.route("/<userid>/friends", methods=["GET"])
def get_friend_list(userid):
    return check_response(
        requests.get(
            SteamWebAPI.build_url(
                SteamWebAPI.USER.value,
                "GetFriendList",
                "0002",
                request.args.get("key"),
                steamid=userid,
                relationship=request.args.get("relationship", "all"),
            )
        )
    )


# /--------------- OFFICIAL STEAMWORKS WEB API PROXY ENDPOINTS (KEY REQUIRED, USES JSON INPUT DTO) ---------------/


@api.route("/<userid>/recent", methods=["GET"])
def get_recently_played_games(userid):
    input = {
        "steamid": userid,
        "count": request.args.get("count"),
    }
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetRecentlyPlayedGames",
                "0001",
                request.args.get("key"),
                input_json=input,
            )
        )
    )


@api.route("/<userid>/games/<game>/playtime", methods=["GET"])
def get_single_game_playtime(userid, game):
    input = {"steamid": userid, "appid": game}
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetSingleGamePlaytime",
                "0001",
                request.args.get("key"),
                input_json=input,
            )
        )
    )


@api.route("/<userid>/games", methods=["GET"])
def get_owned_games(userid, **kwargs):

    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetOwnedGames",
                "0001",
                request.args.get("key", kwargs.get("key")),
                steamid=userid,
                include_appinfo=request.args.get("include_appinfo")
                or kwargs.get("include_appinfo"),
                include_played_free_games=request.args.get("include_played_free_games")
                or kwargs.get("include_played_free_games"),
                appids_filter=request.args.get("appids_filter")
                or kwargs.get("appids_filter"),
            )
        )
    )


@api.route("/<userid>/level", methods=["GET"])
def get_steam_level(userid):
    input = {"steamid": userid}
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetSteamLevel",
                "0001",
                request.args.get("key"),
                input_json=input,
            )
        )
    )


# api.register_blueprint(backend)
