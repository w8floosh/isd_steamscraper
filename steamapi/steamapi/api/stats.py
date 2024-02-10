from quart import Blueprint, request
from httpx import AsyncClient
from steamapi.api.types import SteamWebAPI
from steamapi.api.utils import check_response
from steamapi.broker.types import RedisCacheKeyPattern
from steamapi.broker.utils import read_cache

api = Blueprint("stats", __name__, url_prefix="/stats")
_players = Blueprint("players", __name__, url_prefix="/players")
_apps = Blueprint("apps", __name__, url_prefix="/apps")


@_apps.route("/<id>", methods=["GET"])
async def get_game_stats(id, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
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
    if injected_client is None:
        await client.aclose()
    return result


@_apps.route("/<id>/achievements", methods=["GET"])
async def get_app_global_achievement_percentages(id, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.value,
                "GetGlobalAchievementPercentagesForApp",
                "0002",
                request.args.get("key"),
                gameid=id,
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@_apps.route("/<id>/current", methods=["GET"])
async def get_no_current_players(id, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamWebAPI.build_url(
                SteamWebAPI.STATS.value,
                "GetNumberOfCurrentPlayers",
                "0001",
                request.args.get("key"),
                appid=id,
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@_players.route("/<player>", methods=["GET"])
@read_cache(RedisCacheKeyPattern.USER_DATA, "stats")
async def get_game_user_stats(player, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()

    result = check_response(
        await client.get(
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
    result["appid"] = request.args.get("appid", kwargs.get("appid", "10"))
    if injected_client is None:
        await client.aclose()
    return result


@_players.route("/<player>/achievements", methods=["GET"])
@read_cache(RedisCacheKeyPattern.USER_DATA, "achievements")
async def get_player_achievements(player, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()

    result = check_response(
        await client.get(
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
    if injected_client is None:
        await client.aclose()
    return result


api.register_blueprint(_players)
api.register_blueprint(_apps)
