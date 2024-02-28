import dataclasses
import os
from dataclasses import dataclass, field
from enum import Enum
from functools import wraps
from hashlib import sha256
from os import getenv
from uuid import getnode
from redis.asyncio import StrictRedis, from_url, ConnectionError
from datetime import datetime, UTC
from circuitbreaker import circuit, CircuitBreakerError

CONSUMER_NAME = str(sha256(getnode().to_bytes(6)).digest().hex())
GROUP_NAME = os.getenv("STEAMAPI_CG", "steamapi_cg")
RESPONSES_STREAM = "responses"
REQUESTS_STREAM = "requests"


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
    REQUEST = getenv("REDIS_REQUEST_TIMEOUT", 3000)
    RESPONSE = getenv("REDIS_RESPONSE_TIMEOUT", 3000)
    RECONNECT = 3


@dataclass
class RedisMessage:
    type: RedisMessageType
    requester: str
    payload: dict | list = field(default_factory=dict)


class RedisManager:
    def __init__(self, login):
        self._login = login
        self.connection: StrictRedis = None
        self.last_connection_attempt = None

    @circuit(
        failure_threshold=RedisTimeouts.RECONNECT.value,
        expected_exception=ConnectionError,
    )
    async def connect(self):
        from .utils import setup_consumer

        if self.connection is not None and await self.connection.ping():
            return self.connection

        # Create a new Redis connection
        self.connection = await from_url(
            f"redis://{self._login['url']}:{self._login['port']}/0"
        )

        self.last_connection_attempt = int(datetime.now(UTC).timestamp())
        if await self.connection.ping():
            await setup_consumer(RESPONSES_STREAM, CONSUMER_NAME)

        # Check if the connection is successful
        return self.connection if await self.connection.ping() else None

    async def disconnect(self):
        if self.connection is not None:
            self.connection.close()
            self.connection = None

    def ping(self):
        def decorator(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                from ..app import logger
                from ..api.types import SteamAPIResponse

                while True:
                    try:
                        await self.connect()
                        break
                    except ConnectionError:
                        logger.warn("Could not ping Redis server. Retrying...")
                        continue
                    except CircuitBreakerError:
                        logger.error(
                            "Redis service is unreachable. Please try again in 30 seconds."
                        )
                        return dataclasses.asdict(
                            SteamAPIResponse(
                                False,
                                {},
                                [
                                    "Redis service is unreachable. Please try again in 30 seconds."
                                ],
                            )
                        )
                return await func(*args, **kwargs)

            return wrapper

        return decorator
