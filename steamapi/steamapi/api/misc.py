from flask import Blueprint, request
import requests
from utils import SteamWebAPI

news = Blueprint("news", __name__, url_prefix="/news")


@news.route("/<id>")
def get_app_news(id):
    return requests.get(
        SteamWebAPI.build_url(
            SteamWebAPI.NEWS,
            "GetNewsForApp",
            "0002",
            request.args.key,
            appid=id,
            count=request.args.get("count"),
            maxlength=request.args.get("maxlength"),
        )
    )
