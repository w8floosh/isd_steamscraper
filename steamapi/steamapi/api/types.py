from dataclasses import dataclass, field
from enum import Enum
from sys import stderr
from typing import List, Literal
from httpx import Limits

DEFAULT_API_CLIENT_LIMITS = Limits(max_connections=20)
CleanMode = Literal["take", "pop"]


@dataclass
class SteamAPIResponse:
    success: bool | Literal["with_warnings"]
    data: List[dict] | dict
    errors: List[str] = field(default_factory=list)
    cached: bool = False


class SteamWebAPI(Enum):
    NEWS = "ISteamNews"
    STATS = "ISteamUserStats"
    APPS = "ISteamApps"
    USER = "ISteamUser"
    ECONOMY = "ISteamEconomy"


class SteamworksAPI(Enum):  # has payloads of type { response: {...} }
    PLAYER = "IPlayerService"
    STORE = "IStoreService"


class SteamStoreAPI(Enum):
    GENERIC = "api"
    MARKET = "market"
    MISC = "about"


APIType = SteamWebAPI | SteamStoreAPI | SteamworksAPI
