import asyncio
import dataclasses
import json
from sys import stderr
from quart import Blueprint, request
from httpx import AsyncClient

from ..broker import broker
from ..broker.types import RedisCacheKeyPattern
from ..broker.cache import cached
from ..api.types import DEFAULT_API_CLIENT_LIMITS, SteamAPIResponse, SteamWebAPI
from ..api.utils import build_url, prepare_response, set_payload_from_requests
from ..api.users import get_owned_games

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
    print(result)
    if result.data.get("achievementpercentages"):
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


@_players.route("/<userid>/achievements", methods=["GET"])
@broker.ping(skip_on_failure=True)
@cached(RedisCacheKeyPattern.USER_DATA, ["userid"], ["achievements"], ["appid"])
async def get_player_achievements(userid, **kwargs):
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
                steamid=userid,
                appid=id,
                l=request.args.get("l", kwargs.get("l", "english")),
            )
        )
    )

    if result.success:
        achievements = result.data["playerstats"].get("achievements")
        if not achievements:
            result.success = "with_warnings"
            result.errors.append("No achievements available or unlocked")
        else:
            achievements = [ach for ach in achievements if ach.get("achieved") == 1]
            result.data.update({id: achievements})
        result.data.pop("playerstats")

    if injected_client is None:
        await client.aclose()

    print(
        "DATACLASS->DICT\n", dataclasses.asdict(result), "\n__DICT__\n", result.__dict__
    )
    result = dataclasses.asdict(result)
    return result


@_players.route("/<player>/achievements", methods=["POST"])
@broker.ping(skip_on_failure=True)
async def get_player_achievements_from_appid_list(player, **kwargs):
    async def set_callback(message: dict, requests):
        responses = await asyncio.gather(*requests)
        for result in responses:
            if result.get("success"):
                data: dict = result.get("data")
                if data:
                    appid = list(data.keys())[0]
                    message.update({appid: data.pop(appid)})

    body = json.loads(await request.get_data(as_text=True))
    if not body["appids"]:
        return dataclasses.asdict(
            SteamAPIResponse(False, {}, ["No app IDs were specified"])
        )

    print(body["appids"])
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()

    requests = [
        get_player_achievements(
            player,
            key=request.args.get("key"),
            appid=game,
            session=client,
            custom_req_data={"appid": game},
        )
        for game in body["appids"]
    ]

    result = await set_payload_from_requests(
        dict(), requests, set_callback, DEFAULT_API_CLIENT_LIMITS.max_connections
    )

    if injected_client is None:
        await client.aclose()

    return dataclasses.asdict(SteamAPIResponse(True, result))


api.register_blueprint(_players)
api.register_blueprint(_apps)
