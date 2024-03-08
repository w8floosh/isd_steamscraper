# def build_json_path(*path):
#     pathstr = "$"
#     for level in path:
#         pathstr += f".{level}"
#     return pathstr

# def resolve_path(path: str, *args):
#     result = path
#     for field in path.split("."):
#         if field.startswith("$"):
#             result = result.replace(field, args[int(field.removeprefix("$")) - 1])
#     return result


# def cached(
#     rootpath: RedisCacheKeyPattern,
#     *readpath,
#     keys_only=False,
#     ttl=RedisCacheTTL.MEDIUM,
# ):
#     """Checks if requested data is already cached.
#     If yes, it returns the cached value without executing the decorated request.
#     If the decorated HTTP request specifies the query parameter "renew=true", the cache is invalidated by executing the decorated request.

#     Args:
#         rootpath (str): The root key where to find the requested data.

#         readpath (tuple): Specifies the cache-side path to navigate in order to find and save cached data.

#         keys_only (bool, optional): Return the keys contained in the specified readpath, without returning child data, only if the data exists in the cache.
#         Defaults to False.

#         ttl: (RedisCacheTTL, optional): Set time to live of cache key after reading or writing


#     """

#     def decorator(func):
#         @wraps(func)
#         async def wrapper(*args, **kwargs):
#             from ..broker.redis import broker

#             try:
#                 await ping_broker()
#             except ConnectionError:
#                 return await func(*args, **kwargs)
#             except CircuitBreakerError:
#                 print(
#                     "Broker circuit tripped. Requesting data from the Web", file=stderr
#                 )
#                 return await func(*args, **kwargs)

#             print("executing ", wrapper.__name__, "with kwargs ", kwargs, file=stderr)
#             # 1. data is not cached yet
#             # 2. data is already cached
#             # 3. want to renew the cache
#             external_args = list(kwargs.values())
#             request_args = list(request.args.values())
#             # might not work
#             resolved_rootpath = rootpath.resolve(external_args or request_args)
#             data: dict = None
#             if not request.args.get("renew", kwargs.get("renew", False)):
#                 if keys_only:
#                     data = await broker.connection.json().objkeys(
#                         resolved_rootpath, build_json_path(*readpath)
#                     )
#                 else:
#                     data = await broker.connection.json().get(
#                         resolved_rootpath,
#                         build_json_path(*readpath),
#                         no_escape=True,
#                     )
#                 print(
#                     ("loaded cache" if data else "requesting data from the Web"),
#                     file=stderr,
#                 )
#                 if data:
#                     max_results = request.args.get(
#                         "max_results", kwargs.get("max_results")
#                     )

#                     if max_results:
#                         data = dict(islice(data[0].items(), int(max_results)))
#                     else:
#                         data = data[0]

#                     return dataclasses.asdict(SteamAPIResponse(True, data, cached=True))

#             if not data:
#                 result: dict = await func(*args, **kwargs)
#                 # for entry in result["data"]:
#                 #     print("writing cache for entry ", entry, file=stderr)
#                 await write_cache(
#                     resolved_rootpath,
#                     result.get("data"),
#                     ttl,
#                     *readpath,
#                 )
#                 return result

#         return wrapper

#     return decorator


# async def write_cache(key, value, ttl=RedisCacheTTL.SHORT, *path):
#     from ..broker.redis import broker

#     await broker.connection.json().set(key, "$", {}, nx=True)
#     if path:
#         await broker.connection.json().set(key, build_json_path(*path), {}, nx=True)
#     await broker.connection.json().merge(
#         key, build_json_path(*path) if path else "$", value
#     )

#     if ttl is not RedisCacheTTL.FOREVER:
#         await broker.connection.expire(key, ttl.value)
