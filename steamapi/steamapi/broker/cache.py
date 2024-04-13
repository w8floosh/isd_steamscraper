import dataclasses
from functools import wraps
from itertools import islice
from sys import stderr
from typing import List

from quart import request

from ..api.types import SteamAPIResponse
from .utils import build_json_path, extract_resolve_args
from .types import RedisCacheKeyPattern, RedisCacheTTL
from . import broker


def cached(
    pattern: RedisCacheKeyPattern,
    pattern_args: List,
    readpath: List,
    readpath_args: List = [],
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
            resolve_args = extract_resolve_args(
                pattern_args, kwargs, request.args, request.view_args
            )
            resolve_readpath_args = extract_resolve_args(
                readpath_args, kwargs, request.args, request.view_args
            )
            json_key = pattern.resolve(resolve_args)
            json_path = build_json_path(readpath)
            json_path_with_args = build_json_path(readpath, resolve_readpath_args)
            # 3. want to renew the cache
            renew = request.args.get("renew", kwargs.get("renew", False))
            # add continuous renew protection
            if renew:
                idletime = await broker.connection.object("IDLETIME", json_key)
                # print("idletime for key ", json_key, " is ", idletime, file=stderr)
                if idletime is None or idletime > 30:
                    result: dict = await func(*args, **kwargs)
                    if result["success"]:
                        await write_cache(
                            json_key,
                            result.get("data"),
                            json_path,
                            ttl,
                        )
                    return result

            data: dict = {}

            if keys_only:
                data = await broker.connection.json().objkeys(
                    json_key, json_path_with_args
                )
            else:
                data = await broker.connection.json().get(
                    json_key,
                    json_path_with_args,
                    no_escape=True,
                )
            print(json_key, json_path, json_path_with_args, file=stderr)
            # print(
            #     ("loaded cache" if data else "requesting data from the Web"),
            #     file=stderr,
            # )

            # 2. data is already cached
            if data:
                max_results = request.args.get("max_results", kwargs.get("max_results"))

                if max_results:
                    data = dict(islice(data[0].items(), int(max_results)))
                else:
                    data = data[0]

                if wrapper.__name__ == "get_player_achievements":
                    # @TODO temporary bugfix for achievements tab
                    data = dict({kwargs.get("appid"): data})

                return dataclasses.asdict(SteamAPIResponse(True, data, cached=True))

            # 1. data is not cached yet
            else:
                result: dict = await func(*args, **kwargs)
                if result["success"]:
                    # print(result.get("data"), file=stderr)
                    await write_cache(
                        json_key,
                        result.get("data"),
                        json_path,
                        ttl,
                    )
                return result

        return wrapper

    return decorator


async def write_cache(key, value, path: str, ttl):
    from . import broker

    await broker.connection.json().set(key, "$", {}, nx=True)
    if path:
        # print(path, file=stderr)
        currentpath = ""
        for level in path.split(".")[1:]:
            currentpath = ".".join([currentpath, level])
            await broker.connection.json().set(key, currentpath, {}, nx=True)
    await broker.connection.json().merge(key, path or "$", value)

    if ttl is not RedisCacheTTL.FOREVER:
        await broker.connection.expire(key, ttl.value)
