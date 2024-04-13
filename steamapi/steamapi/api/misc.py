import dataclasses
from quart import Blueprint, request
from httpx import AsyncClient

from ..broker import broker

from ..broker.types import RedisCacheKeyPattern, RedisCacheTTL
from ..broker.cache import cached
from ..api.types import SteamWebAPI
from ..api.utils import build_url, clean_obj, prepare_response

news = Blueprint("news", __name__, url_prefix="/news")


@news.route("/<appid>", methods=["GET"])
@broker.ping(skip_on_failure=True)
@cached(RedisCacheKeyPattern.APP_DATA, ["appid"], ["news"])
async def get_app_news(appid, **kwargs):
    injected_client = kwargs.get("session")
    client = injected_client or AsyncClient()
    result = prepare_response(
        await client.get(
            build_url(
                SteamWebAPI.NEWS,
                "GetNewsForApp",
                "0002",
                request.args.get("key", kwargs.get("key")),
                appid=appid,
                count=request.args.get("count", kwargs.get("count")),
                maxlength=request.args.get("maxlength", kwargs.get("maxlength")),
            )
        )
    )

    news = [
        clean_obj(
            item,
            clean_mode="pop",
            entries=["is_external_url", "feedlabel", "feedname", "feed_type", "appid"],
        )
        for item in result.data["appnews"]["newsitems"]
    ]

    result.data = news

    if injected_client is None:
        await client.aclose()
    return dataclasses.asdict(result)
