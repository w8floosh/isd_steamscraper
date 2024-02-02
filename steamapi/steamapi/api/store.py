from flask import Blueprint, request
import requests
from ..utils import SteamStoreAPI, SteamworksAPI

api = Blueprint("store", __name__, url_prefix="/store")


@api.route("/")
def get_app_list():
    return requests.get(
        SteamworksAPI.build_url(
            SteamworksAPI.STORE, "GetAppList", "1", request.args.key
        )
    )


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
            "storesearch",
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
            "getappsingenre",
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
            "getappsincategory",
            category=query,
            cc=request.args.get("cc", "US"),
            l=request.args.get("l", "english"),
        )
    )
