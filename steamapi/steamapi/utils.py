import json
from enum import Enum
from flask import jsonify, make_response
from sys import stderr

header_configuration = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}


def _extract_query(*route, **kwargs):
    query = ""
    if bool(route):
        for param in route:
            query = "/".join([query, param])
    if not bool(kwargs):
        return query
    query += "?"
    for arg, value in kwargs.items():
        if value is not None:
            query = "&".join([query, f"{arg}={value}"])
    return query


def check_response(response):
    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Convert the response content to a JSON object
        response_data = response.json()
        return jsonify(response_data)
    else:
        # If the request was not successful, you might want to handle the error appropriately
        error_message = f"Error: {response.status_code}"
        return make_response(error_message, response.status_code)


class SteamWebAPI(Enum):
    NEWS = "ISteamNews"
    STATS = "ISteamUserStats"
    APPS = "ISteamApps"
    USER = "ISteamUser"
    ECONOMY = "ISteamEconomy"

    @classmethod
    def build_url(
        self, interface: "SteamWebAPI", call: str, version="0002", key="", **kwargs
    ):
        return f"http://api.steampowered.com/{interface}/{call}/v{version}?key={key}{_extract_query(None, **kwargs)}"


class SteamworksAPI(Enum):
    PLAYER = "IPlayerService"
    INVENTORY = "IInventoryService"
    ECONOMY = "IEconService"
    STORE = "IStoreService"

    @classmethod
    def build_url(
        self, interface: "SteamworksAPI", call: str, version="0002", key="", **kwargs
    ):
        return f"http://api.steampowered.com/{interface}/{call}/v{version}?key={key}&input_json={json.dumps(kwargs)}"


class SteamStoreAPI(Enum):
    GENERIC = "api"
    MARKET = "market"
    MISC = "about"

    @classmethod
    def build_url(self, interface: "SteamStoreAPI", call: str, *route, **kwargs):
        return f"https://store.steampowered.com/{interface}/{call}{_extract_query(*route, **kwargs)}"
