import asyncio
import dataclasses
import json
from sys import stderr
from typing import List
from collections import OrderedDict
from datetime import datetime, UTC
from . import broker
from ..api.types import SteamAPIResponse
from .types import RedisMessage


def build_json_path(path: List, args=[]):
    fullpath = path.copy()
    fullpath.extend(args)
    pathstr = "$"
    for level in fullpath:
        pathstr += f".{level}"
    return pathstr


def extract_resolve_args(args, kw, view, query):
    kwargs = {x: kw[x] for x in kw if x in [*args, "custom_req_data"]}

    ext_args = kwargs.get("custom_req_data", {})
    for ext_kwarg, ext_value in ext_args.items():
        if ext_kwarg in args:
            kwargs.update({ext_kwarg: ext_value})

    keys = [
        *[value for kwarg, value in kwargs.items() if kwarg in args],
        *[value for rarg, value in query.items() if rarg in args],
        *[value for varg, value in view.items() if varg in args],
    ]
    result = OrderedDict.fromkeys(keys)
    return result


async def setup_consumer(stream: str, name: str):
    try:
        await broker.connection.xinfo_stream("_".join([stream, name]))
    except:
        id = await broker.connection.xadd("_".join([stream, name]), {name: 0})
        await broker.connection.xdel("_".join([stream, name]), id.decode("UTF-8"))


async def send_request(message: RedisMessage):
    from .types import REQUESTS_STREAM, CONSUMER_NAME

    request = dataclasses.asdict(message)
    request.update(
        {"payload": json.dumps(request["payload"]), "consumer": CONSUMER_NAME}
    )

    reqid = await asyncio.ensure_future(
        broker.connection.xadd(REQUESTS_STREAM, request)
    )
    return reqid


async def get_response(user: str, mstimeout: int = 1000):
    from .types import CONSUMER_NAME, GROUP_NAME, RESPONSES_STREAM, REQUESTS_STREAM

    response_timeout = int(datetime.now(UTC).timestamp()) + 3 * mstimeout / 1000
    while int(datetime.now(UTC).timestamp()) <= response_timeout:
        messages = await broker.connection.xread(
            dict({f"{RESPONSES_STREAM}_{CONSUMER_NAME}": "$"}),
            block=mstimeout,
        )
        if messages:
            for _, message_list in messages:
                if not len(message_list):
                    break
                for message in message_list:
                    msg_id, msg_data = message
                    msg_data = bdecode(msg_data)
                    # change to user token (user A could request data of user B)
                    if msg_data["requester"] == user:
                        msg_data["payload"] = json.loads(msg_data["payload"])
                        await broker.connection.xack(
                            REQUESTS_STREAM, GROUP_NAME, msg_id
                        )
                        response_args = [
                            msg_data["payload"]["success"],
                            msg_data["payload"]["data"],
                            msg_data["payload"]["errors"],
                            msg_data["payload"]["cached"],
                        ]
                        return SteamAPIResponse(*response_args)
        # retries += 1
    return SteamAPIResponse(False, {}, ["Response timeout"])


def bdecode(data):
    return {key.decode("UTF-8"): value.decode("UTF-8") for key, value in data.items()}
