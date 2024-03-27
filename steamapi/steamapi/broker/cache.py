import dataclasses
from functools import wraps
from itertools import islice
from sys import stderr
from typing import List

from quart import request

from ..api.types import SteamAPIResponse
from .utils import build_json_path
from .types import RedisCacheKeyPattern, RedisCacheTTL
from . import broker


def cached(
    pattern: RedisCacheKeyPattern,
    pattern_args: List = [],
    readpath: List = [],
    keys_only=False,
    ttl=RedisCacheTTL.LONGEST,
):
    """Checks if requested data is already cached.
    If yes, it returns the cached value without executing the decorated request.
    If the decorated HTTP request specifies the query parameter "renew=true", the cache is invalidated by executing the decorated request.

    Args:
        rootpath (str): The root key where to find the requested data.

        readpath (list): Specifies the cache-side path to navigate in order to find and save cached data.

        keys_only (bool, optional): Return the keys contained in the specified readpath, without returning child data, only if the data exists in the cache.
        Defaults to False.

        ttl: (RedisCacheTTL, optional): Set time to live of cache key after reading or writing


    """

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # vv Does not work? vv
            json_key = pattern.resolve(
                [].extend(
                    [
                        *[
                            value
                            for kwarg, value in kwargs.items()
                            if kwarg in pattern_args
                        ],
                        *[
                            value
                            for rarg, value in request.args.items()
                            if rarg in pattern_args
                        ],
                        *[
                            value
                            for varg, value in request.view_args.items()
                            if varg in pattern_args
                        ],
                    ]
                )
            )

            json_path = build_json_path(*readpath)
            # 3. want to renew the cache
            renew = request.args.get("renew", kwargs.get("renew", False))
            # add continuous renew protection
            if renew and (
                int(await broker.connection.object("IDLETIME", json_key)) < 30
            ):
                result: dict = await func(*args, **kwargs)
                await write_cache(
                    json_key,
                    result.get("data"),
                    ttl,
                    json_path,
                )
                return result

            data: dict = {}

            if keys_only:
                data = await broker.connection.json().objkeys(json_key, json_path)
            else:
                data = await broker.connection.json().get(
                    json_key,
                    json_path,
                    no_escape=True,
                )
            print(
                ("loaded cache" if data else "requesting data from the Web"),
                file=stderr,
            )

            # 2. data is already cached
            if data:
                max_results = request.args.get("max_results", kwargs.get("max_results"))

                if max_results:
                    data = dict(islice(data[0].items(), int(max_results)))
                else:
                    data = data[0]

                return dataclasses.asdict(SteamAPIResponse(True, data, cached=True))

            # 1. data is not cached yet
            else:
                result: dict = await func(*args, **kwargs)
                await write_cache(
                    json_key,
                    result.get("data"),
                    ttl,
                    json_path,
                )
                return result

        return wrapper

    return decorator


async def write_cache(key, value, path=None, ttl=RedisCacheTTL.SHORT):
    from . import broker

    await broker.connection.json().set(key, "$", {}, nx=True)
    if path:
        await broker.connection.json().set(key, path, {}, nx=True)
    await broker.connection.json().merge(key, "$", value)

    if ttl is not RedisCacheTTL.FOREVER:
        await broker.connection.expire(key, ttl.value)
