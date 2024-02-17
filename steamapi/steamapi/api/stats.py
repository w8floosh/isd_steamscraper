import dataclasses
from quart import Blueprint, request
from httpx import AsyncClient
from ..api.types import SteamWebAPI
from ..api.utils import build_url, prepare_response
from ..broker.types import RedisCacheKeyPattern
from ..broker.utils import cached

api = Blueprint("stats", __name__, url_prefix="/stats")
_players = Blueprint("players", __name__, url_prefix="/players")
_apps = Blueprint("apps", __name__, url_prefix="/apps")


@_apps.route("/<id>/achievements", methods=["GET"])
async def get_app_global_achievement_percentages(id, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = prepare_response(
        await client.get(
            build_url(
                SteamWebAPI.STATS,
                "GetGlobalAchievementPercentagesForApp",
                "0002",
                request.args.get("key"),
                gameid=id,
            )
        )
    )

    achievements = result.data["achievementpercentages"]["achievements"]
    result.data.update({id: dict()})
    for ach in achievements:
        result.data[id].update({ach["name"]: ach["percent"]})

    result.data.pop("achievementpercentages")

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)


@_apps.route("/<id>/current", methods=["GET"])
async def get_no_current_players(id, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = prepare_response(
        await client.get(
            build_url(
                SteamWebAPI.STATS,
                "GetNumberOfCurrentPlayers",
                "0001",
                request.args.get("key"),
                appid=id,
            )
        )
    )
    result.data = {"player_count": result.data["response"]["player_count"]}
    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)


@_players.route("/<player>/achievements", methods=["GET"])
@cached(RedisCacheKeyPattern.USER_DATA, "achievements")
async def get_player_achievements(player, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    id = request.args.get("appid", kwargs.get("appid"))
    result = prepare_response(
        await client.get(
            build_url(
                SteamWebAPI.STATS,
                "GetPlayerAchievements",
                "0001",
                request.args.get("key", kwargs.get("key")),
                steamid=player,
                appid=id,
                l=request.args.get("l", kwargs.get("l", "english")),
            )
        )
    )

    achievements = result.data["playerstats"]["achievements"]
    result.data.update({id: achievements})
    result.data.pop("playerstats")

    if injected_client is None:
        await client.aclose()

    return dataclasses.asdict(result)


api.register_blueprint(_players)
api.register_blueprint(_apps)
