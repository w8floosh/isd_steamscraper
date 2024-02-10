from enum import Enum
from os import getenv


class RedisCacheTTL(Enum):
    DEBUG = 30  # 30s
    SHORT = 3600  # 1h
    MEDIUM = 43200  # 12h
    LONG = 86400  # 1d
    LONGEST = 259200  # 3d


class RedisCacheKeyPattern(Enum):
    USER_DATA = "user*[0-9]"  # hashmap
    # USER_STATS = "user*[0-9]:stats"  # hashmap
    # USER_ACHIEVEMENTS = "user*[0-9]:achievements"  # hashmap
    # USER_FRIENDS = "user*[0-9]:friends"  # hashmap
    # USER_LEVEL = "user*[0-9]:level"  # key

    APP_IS_CACHED = "app:cached:*[0-9]"
    APP_DATA = "app*[0-9]"
    COMPUTED_DATA = "computed*[0-9]"

    def resolve(self, *args):
        result = self.value
        for arg in args:
            try:
                if int(arg):
                    result = result.replace("*[0-9]", arg)
            except:
                continue
        return result


class RedisMessageTypes(Enum):
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


class RedisMessage:
    def __init__(self, owner, type: RedisMessageTypes):
        self._type = type
        self._payload = dict()
        self._owner = owner

    def payload_set(self, key, value, *value_structure):
        if bool(value_structure):
            try:
                for field in value_structure:
                    value = value[field]
            except:
                return self._payload.update({key: {}})
        self._payload.update({key: value})
