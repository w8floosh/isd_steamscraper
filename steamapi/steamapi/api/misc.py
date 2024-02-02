from flask import Blueprint, request
import requests
from ..utils import SteamWebAPI, check_response

news = Blueprint("news", __name__, url_prefix="/news")


@news.route("/<id>")
def get_app_news(id):
    return check_response(
        requests.get(
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
