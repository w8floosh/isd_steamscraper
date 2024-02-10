from quart import Blueprint, request
from httpx import AsyncClient
from steamapi.api.types import SteamWebAPI
from steamapi.api.utils import check_response
from steamapi.broker.types import RedisCacheKeyPattern
from steamapi.broker.utils import read_cache

news = Blueprint("news", __name__, url_prefix="/news")


@news.route("/<id>", methods=["GET"])
@read_cache(RedisCacheKeyPattern.APP_DATA, "news")
async def get_app_news(id, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = check_response(
        await client.get(
            SteamWebAPI.build_url(
                SteamWebAPI.NEWS.value,
                "GetNewsForApp",
                "0002",
                request.args.get("key"),
                appid=id,
                count=request.args.get("count"),
                maxlength=request.args.get("maxlength"),
            )
        )
    )
    if injected_client is None:
        await client.aclose()
    return result
