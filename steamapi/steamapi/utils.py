from enum import Enum
from flask import jsonify, make_response
from sys import stderr


class RedisMessageTypes(Enum):
    USER_ACHIEVEMENTS_SCORE = 101
    USER_FAVORITE_GENRES_CATEGORIES = 102
    USER_LIBRARY_VALUE = 103
    USER_FORGOTTEN_GAMES = 104

    LEADERBOARD_ACHIEVEMENTS_SCORE = 201
    LEADERBOARD_PLAYTIME = 202
    LEADERBOARD_LIBRARY_VALUE = 203
    LEADERBOARD_VERSATILITY_SCORE = 204


class RedisMessage:
    def __init__(self, type: RedisMessageTypes):
        self._type = type
        self._payload = dict()

    def payload_set(self, key: RedisMessageTypes, value: dict):
        self._payload.update({key: value})


def _extract_query(key, *route, **kwargs):
    query = ""
    if bool(route):
        for param in route:
            query = "/".join([query, param])
    if not bool(kwargs):
        return query

    query += "?"
    if bool(key):
        query += f"key={key}"

    args = ""
    for arg, value in kwargs.items():
        if value is not None:
            args = "&".join([args, f"{arg}={value}"])

    print(args, file=stderr)

    return "".join([query, args])


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
        print(
            f"http://api.steampowered.com/{interface}/{call}/v{version}{_extract_query(key, **kwargs)}"
        )
        return f"http://api.steampowered.com/{interface}/{call}/v{version}{_extract_query(key, **kwargs)}"


class SteamworksAPI(Enum):
    PLAYER = "IPlayerService"
    INVENTORY = "IInventoryService"
    ECONOMY = "IEconService"
    STORE = "IStoreService"

    @classmethod
    def build_url(
        self, interface: "SteamworksAPI", call: str, version="0002", key="", **kwargs
    ):
        print(
            f"http://api.steampowered.com/{interface}/{call}/v{version}{_extract_query(key, **kwargs)}"
        )
        return f"http://api.steampowered.com/{interface}/{call}/v{version}{_extract_query(key, **kwargs)}"


class SteamStoreAPI(Enum):
    GENERIC = "api"
    MARKET = "market"
    MISC = "about"

    @classmethod
    def build_url(self, interface: "SteamStoreAPI", call: str, *route, **kwargs):
        return f"https://store.steampowered.com/{interface}/{call}{_extract_query(*route, **kwargs)}"
