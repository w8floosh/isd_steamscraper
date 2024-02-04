from flask import Blueprint, request
import requests
from ..utils import SteamStoreAPI, SteamworksAPI, check_response, header_configuration
from sys import stderr

api = Blueprint("store", __name__, url_prefix="/store")


@api.route("/")
def get_app_list():
    return check_response(
        requests.get(
            SteamworksAPI.build_url(
                SteamworksAPI.STORE.value,
                "GetAppList",
                "1",
                request.args.get("key"),
                max_results=request.args.get("max_results", 50000),
                last_appid=request.args.get("last_appid", 10),
            )
        )
    )


@api.route("/<id>/details")
def get_app_details(id, **kwargs):
    """cannot execute for multiple apps, inconsistent behavior"""
    return check_response(
        requests.get(
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


@api.route("/<query>")
def store_search(query):
    return check_response(
        requests.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC.value,
                "storesearch",
                term=query,
                cc=request.args.get("cc", "US"),
                l=request.args.get("l", "english"),
            )
        )
    )


@api.route("/genre/<query>")
def get_apps_in_genre(query):
    return check_response(
        requests.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC,
                "getappsingenre",
                genre=query,
                cc=request.args.get("cc", "US"),
                l=request.args.get("l", "english"),
            )
        )
    )


@api.route("/category/<query>")
def get_apps_in_category(query):
    return check_response(
        requests.get(
            SteamStoreAPI.build_url(
                SteamStoreAPI.GENERIC,
                "getappsincategory",
                category=query,
                cc=request.args.get("cc", "US"),
                l=request.args.get("l", "english"),
            )
        )
    )
