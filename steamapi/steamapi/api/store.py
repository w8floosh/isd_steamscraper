from flask import Blueprint, request
import requests
from utils import SteamStoreAPI

api = Blueprint("store", __name__, url_prefix="/store")


@api.route("/<id>/details")
def get_app_details(id):
    """cannot execute for multiple apps, inconsistent behavior"""
    return requests.get(
        SteamStoreAPI.build_url(
            SteamStoreAPI.GENERIC,
            "appdetails",
            appids=id,
            filters=request.args.get("filters"),
            cc=request.args.get("cc", "US"),
            language=request.args.get("language", "english"),
        )
    )


@api.route("/<query>")
def store_search(query):
    return requests.get(
        SteamStoreAPI.build_url(
            SteamStoreAPI.GENERIC,
            term=query,
            cc=request.args.get("cc", "US"),
            l=request.args.get("l", "english"),
        )
    )


@api.route("/genre/<query>")
def get_apps_in_genre(query):
    return requests.get(
        SteamStoreAPI.build_url(
            SteamStoreAPI.GENERIC,
            genre=query,
            cc=request.args.get("cc", "US"),
            l=request.args.get("l", "english"),
        )
    )


@api.route("/category/<query>")
def get_apps_in_category(query):
    return requests.get(
        SteamStoreAPI.build_url(
            SteamStoreAPI.GENERIC,
            category=query,
            cc=request.args.get("cc", "US"),
            l=request.args.get("l", "english"),
        )
    )
