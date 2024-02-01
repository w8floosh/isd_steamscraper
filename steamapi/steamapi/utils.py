from enum import Enum

def _extract_query(*route, **kwargs):
    query = ""
    if bool(route):
        for param in route:
            query = "/".join([query, param])
    if not bool(kwargs): return query
    query += '?'
    for arg, value in kwargs.items():
        if value is not None:
            query = "&".join([query, f"{arg}={value}"])
    return query

class API:
    @classmethod
    def build_url(self, interface: 'API', call: str, version = "0002", key = "", **kwargs):
        return f"http://api.steampowered.com/{interface}/{call}/v{version}?key={key}{_extract_query(None, **kwargs)}"
    
class SteamWebAPI(API, Enum):
    NEWS = "ISteamNews"
    STATS = "ISteamUserStats"
    APPS = "ISteamApps"
    USER = "ISteamUser"
    ECONOMY = "ISteamEconomy"

class SteamworksAPI(API, Enum):
    PLAYER = "IPlayerService"
    INVENTORY = "IInventoryService"
    ECONOMY = "IEconService"

class SteamStoreAPI(API, Enum):
    GENERIC = "api"
    MARKET = "market"
    MISC = "about"
    
    @classmethod
    def build_url(self, interface: 'SteamStoreAPI', call: str, *route, **kwargs):
        return f"https://store.steampowered.com/{interface}/{call}{_extract_query(*route, **kwargs)}"





