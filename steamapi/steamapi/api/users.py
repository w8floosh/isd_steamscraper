import dataclasses
import json
from quart import Blueprint, request
from httpx import AsyncClient

from ..broker import broker
from ..broker.types import RedisCacheKeyPattern
from ..broker.cache import cached
from ..api.types import SteamWebAPI, SteamworksAPI
from ..api.utils import build_url, clean_obj, prepare_response

api = Blueprint("users", __name__, url_prefix="/users")


@api.route("/<userid>/friends", methods=["GET"])
@broker.ping(skip_on_failure=True)
@cached(RedisCacheKeyPattern.USER_DATA, ["userid"], ["friends"])
async def get_friend_list(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = prepare_response(
        await client.get(
            build_url(
                SteamWebAPI.USER,
                "GetFriendList",
                "0001",
                request.args.get("key", kwargs.get("key")),
                steamid=userid,
            )
        )
    )

    friends = result.data["friendslist"]["friends"]
    for friend in friends:
        friend.pop("relationship")

    result.data = friends

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)


@api.route("/<userid>/summary", methods=["GET"])
@broker.ping(skip_on_failure=True)
@cached(RedisCacheKeyPattern.USER_DATA, ["userid"], ["summary"])
async def get_player_summary(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = prepare_response(
        await client.get(
            build_url(
                SteamWebAPI.USER,
                "GetPlayerSummaries",
                "0002",
                request.args.get("key", kwargs.get("key")),
                steamids=userid,
            )
        )
    )

    player = result.data["response"]["players"][0]
    player = clean_obj(player, entries=["avatar", "personaname"])

    result.data.update({userid: player})
    result.data.pop("response")

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)


@api.route("/<userid>/recent", methods=["GET"])
async def get_recently_played_games(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    input = {
        "steamid": userid,
        "count": request.args.get("count", 20),
    }
    result = prepare_response(
        await client.get(
            build_url(
                SteamworksAPI.PLAYER,
                "GetRecentlyPlayedGames",
                "0001",
                request.args.get("key"),
                input_json=json.dumps(input, indent=None),
            )
        )
    )

    games = result.data["response"].get("games", None)
    if games:
        for game in games:
            id = game.pop("appid")
            result.data.update({id: game})
    else:
        result.errors.append("No games found")
        result.success = "with_warnings"
    result.data.pop("response")

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)


@api.route("/<userid>/games", methods=["GET"])
@broker.ping(skip_on_failure=True)
@cached(RedisCacheKeyPattern.USER_DATA, ["userid"], ["games"])
async def get_owned_games(userid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = prepare_response(
        await client.get(
            build_url(
                SteamworksAPI.PLAYER,
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
    try:
        games = result.data["response"]["games"]

        games_dict = dict()
        for game in games:
            id = game.pop("appid")
            games_dict.update({str(id): game})

        result.data = games_dict
    except:
        result.success = False
        result.data = {}
        result.errors.append(
            f"Could not retrieve data for steamid {userid}. User may not exist or have a private profile."
        )
    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)
