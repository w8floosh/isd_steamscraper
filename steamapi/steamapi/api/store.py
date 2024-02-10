from quart import Blueprint, request
from httpx import AsyncClient, Timeout
from steamapi.api.types import SteamStoreAPI, SteamworksAPI
from steamapi.api.utils import check_response
from steamapi.broker.types import RedisCacheKeyPattern
from steamapi.broker.utils import read_cache

api = Blueprint("store", __name__, url_prefix="/store")


@api.route("/", methods=["GET"])
@read_cache(RedisCacheKeyPattern.APP_DATA)
async def get_app_list(**kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient(timeout=Timeout(timeout=60))

    result = check_response(
        await client.get(
            SteamworksAPI.build_url(
                SteamworksAPI.STORE.value,
                "GetAppList",
                "1",
                request.args.get("key"),
                max_results=request.args.get("max_results", 10000),
                last_appid=request.args.get("last_appid", 10),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@api.route("/<id>/details", methods=["GET"])
@read_cache(RedisCacheKeyPattern.APP_DATA, "details", original_readpath="$1.data")
async def get_app_details(id, **kwargs):
    """Can be executed for multiple apps only for price retrieval"""
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC.value,
                "appdetails",
                appids=id,
                filters=request.args.get("filters", kwargs.get("filters")),
                cc=request.args.get("cc", kwargs.get("cc", "US")),
                language=request.args.get(
                    "language", kwargs.get("language", "english")
                ),
            ),
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@api.route("/<query>")
async def store_search(query, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC.value,
                "storesearch",
                term=query,
                cc=request.args.get("cc", "US"),
                l=request.args.get("l", "english"),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@api.route("/genre/<query>")
async def get_apps_in_genre(query, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC,
                "getappsingenre",
                genre=query,
                cc=request.args.get("cc", "US"),
                l=request.args.get("l", "english"),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result


@api.route("/category/<query>")
async def get_apps_in_category(query, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC,
                "getappsincategory",
                category=query,
                cc=request.args.get("cc", "US"),
                l=request.args.get("l", "english"),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result
