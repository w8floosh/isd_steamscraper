import dataclasses
import json
from quart import Blueprint, request
from httpx import AsyncClient
from ..api.types import SteamWebAPI, SteamworksAPI
from ..api.utils import build_url, clean_obj, prepare_response
from ..broker.types import RedisCacheKeyPattern
from ..broker.utils import cached

api = Blueprint("users", __name__, url_prefix="/users")


@api.route("/<userid>/friends", methods=["GET"])
@cached(RedisCacheKeyPattern.USER_DATA, "friends")
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
                relationship=request.args.get(
                    "relationship", kwargs.get("relationship", "friends")
                ),
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
@cached(RedisCacheKeyPattern.USER_DATA, "games")
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

    games = result.data["response"]["games"]
    games = [
        clean_obj(game, clean_mode="pop", entries=["img_icon_url"]) for game in games
    ]
    for game in games:
        id = game.pop("appid")
        result.data.update({id: game})

    result.data.pop("response")
    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)
