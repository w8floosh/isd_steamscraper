from enum import Enum
from aiofiles import stderr
from httpx import Limits
from steamapi.api.utils import extract_query

DEFAULT_API_CLIENT_LIMITS = Limits(max_connections=5)


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
            f"http://api.steampowered.com/{interface}/{call}/v{version}{extract_query(key, **kwargs)}",
            file=stderr,
        )
        return f"http://api.steampowered.com/{interface}/{call}/v{version}{extract_query(key, **kwargs)}"


class SteamworksAPI(Enum):
    PLAYER = "IPlayerService"
    INVENTORY = "IInventoryService"
    ECONOMY = "IEconService"
    STORE = "IStoreService"

    @classmethod
    def build_url(
        self, interface: "SteamworksAPI", call: str, version="0002", key="", **kwargs
    ):
        # print(
        #     f"http://api.steampowered.com/{interface}/{call}/v{version}{extract_query(key, **kwargs)}",
        #     file=stderr,
        # )
        return f"http://api.steampowered.com/{interface}/{call}/v{version}{extract_query(key, **kwargs)}"


class SteamStoreAPI(Enum):
    GENERIC = "api"
    MARKET = "market"
    MISC = "about"

    @classmethod
    def build_url(self, interface: "SteamStoreAPI", call: str, *route, **kwargs):
        return f"https://store.steampowered.com/{interface}/{call}{extract_query(None, *route, **kwargs)}"
