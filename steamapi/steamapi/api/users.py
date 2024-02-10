from quart import Blueprint, request
from httpx import AsyncClient
from steamapi.api.types import SteamWebAPI, SteamworksAPI
from steamapi.api.utils import check_response
from steamapi.broker.types import RedisCacheKeyPattern
from steamapi.broker.utils import read_cache

api = Blueprint("users", __name__, url_prefix="/users")


@api.route("/<userid>/friends", methods=["GET"])
@read_cache(RedisCacheKeyPattern.USER_DATA, "friends")
async def get_friend_list(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamWebAPI.build_url(
                SteamWebAPI.USER.value,
                "GetFriendList",
                "0001",
                request.args.get("key", kwargs.get("key")),
                steamid=userid,
                relationship=request.args.get(
                    "relationship", kwargs.get("relationship", "friends")
                ),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


# /--------------- OFFICIAL STEAMWORKS WEB API PROXY ENDPOINTS (KEY REQUIRED, USES JSON INPUT DTO) ---------------/


@api.route("/<userid>/recent", methods=["GET"])
async def get_recently_played_games(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    input = {
        "steamid": userid,
        "count": request.args.get("count"),
    }
    result = check_response(
        await client.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetRecentlyPlayedGames",
                "0001",
                request.args.get("key"),
                input_json=input,
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@api.route("/<userid>/games", methods=["GET"])
@read_cache(RedisCacheKeyPattern.USER_DATA, "games")
async def get_owned_games(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetOwnedGames",
                "0001",
                request.args.get("key", kwargs.get("key")),
                steamid=userid,
                include_appinfo=request.args.get(
                    "include_appinfo", kwargs.get("include_appinfo")
                ),
                include_played_free_games=request.args.get(
                    "include_played_free_games", kwargs.get("include_played_free_games")
                ),
                appids_filter=request.args.get(
                    "appids_filter", kwargs.get("appids_filter")
                ),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@api.route("/<userid>/level", methods=["GET"])
@read_cache(RedisCacheKeyPattern.USER_DATA, "level")
async def get_steam_level(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    input = {"steamid": userid}
    result = check_response(
        await client.get(
            SteamworksAPI.build_url(
                SteamworksAPI.PLAYER.value,
                "GetSteamLevel",
                "0001",
                request.args.get("key"),
                input_json=input,
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result
