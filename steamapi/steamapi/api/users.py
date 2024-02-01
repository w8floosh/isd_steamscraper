from flask import Blueprint, request
import requests
from utils import SteamWebAPI, SteamworksAPI

api = Blueprint("users", __name__, url_prefix="/users")


@api.route("/", methods=["GET"])
def get_player_summaries():
    return requests.get(
        SteamWebAPI.build_url(
            SteamWebAPI.USER,
            "GetPlayerSummaries",
            "0002",
            request.args.key,
            steamids=request.args.get("steamids"),
        )
    )


@api.route("/<userid>/friends", methods=["GET"])
def get_friend_list(userid):
    return requests.get(
        SteamWebAPI.build_url(
            SteamWebAPI.USER,
            "GetFriendList",
            "0002",
            request.args.key,
            steamid=userid,
            relationship=request.args.get("relationship", "all"),
        )
    )


# /--------------- OFFICIAL STEAMWORKS WEB API PROXY ENDPOINTS (KEY REQUIRED, USES JSON INPUT DTO) ---------------/


@api.route("/<userid>/recent", methods=["GET"])
def get_recently_played_games(userid):
    return requests.get(
        SteamworksAPI.build_url(
            SteamworksAPI.PLAYER,
            "GetRecentlyPlayedGames",
            "0001",
            request.args.key,
            steamid=userid,
            count=request.args.get("count"),
        )
    )


@api.route("/<userid>/games/<game>/playtime", methods=["GET"])
def get_single_game_playtime(userid, game):
    return requests.get(
        SteamworksAPI.build_url(
            SteamworksAPI.PLAYER,
            "GetSingleGamePlaytime",
            "0001",
            request.args.key,
            steamid=userid,
            appid=game,
        )
    )


@api.route("/<userid>/games", methods=["GET"])
def get_owned_games(userid):
    return requests.get(
        SteamworksAPI.build_url(
            SteamworksAPI.PLAYER,
            "GetOwnedGames",
            "0001",
            request.args.key,
            steamid=userid,
            include_appinfo=request.args.get("include_appinfo"),
            include_played_free_games=request.args.get("include_played_free_games"),
            appids_filter=request.args.get("appids_filter"),
        )
    )


@api.route("/<userid>/level", methods=["GET"])
def get_steam_level(userid):
    return requests.get(
        SteamworksAPI.build_url(
            SteamworksAPI.PLAYER,
            "GetSteamLevel",
            "0001",
            request.args.key,
            steamid=userid,
        )
    )
