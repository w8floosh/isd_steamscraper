from dataclasses import dataclass
from enum import Enum
from os import getenv
from redis.asyncio import StrictRedis, from_url
from datetime import datetime, UTC


class RedisManager:
    def __init__(self, login):
        self._login = login
        self.connection: StrictRedis = None
        self.last_connection_attempt = None

    async def connect(self):
        if self.connection is not None and await self.connection.ping():
            return self.connection

        # Create a new Redis connection
        self.connection = await from_url(
            f"redis://{self._login['url']}:{self._login['port']}/0"
        )

        self.last_connection_attempt = int(datetime.now(UTC).timestamp())

        # Check if the connection is successful
        await self.connection.ping()

        return self.connection

    async def disconnect(self):
        if self.connection is not None:
            self.connection.close()
            self.connection = None


class RedisCacheTTL(Enum):
    FOREVER = 0  # no expiry
    DEBUG = 30  # 30s
    SHORT = 3600  # 1h
    MEDIUM = 43200  # 12h
    LONG = 86400  # 1d
    LONGEST = 259200  # 3d


class RedisCacheKeyPattern(Enum):
    USER_DATA = "user*[0-9]"
    APP_LIST = "apps"
    APP_DATA = "app*[0-9]"
    COMPUTED_DATA = "computed*[0-9]"

    def resolve(self, args):
        result = self.value
        for arg in args:
            try:
                if int(arg):
                    result = result.replace("*[0-9]", arg)
            except:
                continue
        return result


class RedisMessageType(Enum):
    USER_ACHIEVEMENTS_SCORE = 101
    USER_FAVORITE_GENRES_CATEGORIES = 102
    USER_LIBRARY_VALUE = 103
    USER_FORGOTTEN_GAMES = 104

    LEADERBOARD_ACHIEVEMENTS_SCORE = 201
    LEADERBOARD_PLAYTIME = 202
    LEADERBOARD_LIBRARY_VALUE = 203
    LEADERBOARD_VERSATILITY_SCORE = 204


class RedisTimeouts(Enum):
    REQUEST = getenv("REDIS_REQUEST_TIMEOUT")
    RESPONSE = getenv("REDIS_RESPONSE_TIMEOUT")
    RECONNECT = 3


@dataclass
class RedisMessage:
    type: RedisMessageType
    owner: str
    payload: dict
