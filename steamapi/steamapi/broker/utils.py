import functools
from redis.asyncio import from_url, Redis
from redis.asyncio.client import PubSub, ChannelT
from async_timeout import timeout
from sys import stderr
from steamapi.broker.types import RedisCacheKeyPattern, RedisMessage, RedisCacheTTL
from steamapi.api.utils import build_response
from quart import request, jsonify, Response


async def redis_init(login):
    return await from_url(
        # f"redis://{login.username}:{login.password}@{login.url}:{login.port}/0"
        f"redis://{login['url']}:{login['port']}/0"
    )


def build_json_path(*path):
    pathstr = "$"
    for level in path:
        pathstr += f".{level}"
    return pathstr


def resolve_readpath(path: str, *args):
    result = path
    for field in path.split("."):
        if field.startswith("$"):
            result = result.replace(field, args[int(field.removeprefix("$")) - 1])
    return result


async def set_path_if_does_not_exist(broker: Redis, key, *path):
    readpath = "$"
    for field in path:
        if not await broker.json().get(key, readpath, no_escape=True):
            await broker.json().set(key, readpath, {})
        readpath += f".{field}"


def read_cache(
    rootpath: RedisCacheKeyPattern,
    *readpath,
    ttl=RedisCacheTTL.DEBUG,
    keys_only=False,
    original_readpath=None,
):
    """Checks if requested data is already cached.
    If yes, it returns the cached value without executing the decorated request.
    If the decorated HTTP request specifies the query parameter "renew=true", the cache is invalidated by executing the decorated request.

    Args:
        rootpath (str): The root key where to find the requested data.

        readpath (tuple): Specifies the cache-side path to navigate in order to find and save cached data.

        keys_only (bool, optional): Return the keys contained in the specified readpath, without returning child data, only if the data exists in the cache.
        Defaults to False.

        original_readpath (str, optional): Specifies the root path from where the JSON extracted from the API should be read to get the right data.
        String format example: $1.field1.field2 ($i = i-th argument of decorated request = kwargs.values()[i-1])
        Defaults to None (it assumes that the data to cache is the entire JSON received).


    """

    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            from steamapi.broker.redis import broker

            # 1. data is not cached yet
            # 2. data is already cached
            # 3. want to renew the cache
            resolved_rootpath = rootpath.resolve(*(list(kwargs.values())))
            data = None
            if not kwargs.get("renew", False):
                if keys_only:
                    data = await broker.json().objkeys(
                        resolved_rootpath, build_json_path(*readpath)
                    )
                else:
                    data = await broker.json().get(
                        resolved_rootpath,
                        build_json_path(*readpath),
                        no_escape=True,
                    )
                print(
                    "loaded cache" if data else "requesting data from the Web",
                    file=stderr,
                )
            if data is None:
                data = await func(*args, **kwargs)
                if original_readpath:
                    resolved_readpath = resolve_readpath(
                        original_readpath, *(list(kwargs.values()))
                    )
                    for key in resolved_readpath.split("."):
                        data = data[key]

                # breakpoint()
                await set_path_if_does_not_exist(broker, resolved_rootpath, *readpath)
                await broker.json().merge(
                    resolved_rootpath, build_json_path(*readpath), data
                )
                await broker.expire(resolved_rootpath, ttl.value)

            return data

        return wrapper

    return decorator


async def _make_redis_request(
    broker: Redis, message: RedisMessage, resch: ChannelT, **kwargs
) -> PubSub | None:
    async with timeout(5):
        try:
            # move channel creation logic to the auth module (channels shouldn't be created and removed continuously, performance issues)
            # with that said, this function should have the channel as argument
            channel = kwargs.get("reqch") or await broker.pubsub()
            await channel.subscribe(resch)
            print(
                f"User {request.args.get('key')} subscribed to its channel",
                file=stderr,
            )
            await broker.publish(channel, message)
            return channel

        except:
            return None


async def get_redis_result(
    broker: Redis, message: RedisMessage, resch: ChannelT, **kwargs
) -> Response:
    async with timeout(60):

        reqch = await _make_redis_request(broker, message, resch, **kwargs)

        if reqch is None:
            return build_response({}, 500, "Redis service unreachable")

        message = await reqch.get_message(ignore_subscribe_messages=True)
        # await reqch.close()
        result = jsonify(message["data"].decode())
        return build_response(result, 200)
