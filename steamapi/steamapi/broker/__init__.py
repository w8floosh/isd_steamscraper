from .types import RedisManager
from os import environ

broker = RedisManager(
    {
        "host": environ.get("REDIS_HOST"),
        "port": environ.get("REDIS_PORT"),
    }
)
