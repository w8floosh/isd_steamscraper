import asyncio
import dataclasses
from sys import stderr

from quart import Blueprint, request
from httpx import AsyncClient

from ..broker import broker
from ..broker.utils import get_response, send_request
from ..broker.types import RedisMessage, RedisMessageType
from ..api.users import get_owned_games, get_friend_list
from ..api.utils import set_payload_from_requests
from ..api.types import DEFAULT_API_CLIENT_LIMITS
from ..api.user_stats import get_achievement_score

api = Blueprint("leaderboards", __name__, url_prefix="/compute/stats/leaderboards")


async def _set_payload_with_playtimes(userid, message: RedisMessage):
    async def set_callback(message: RedisMessage, requests):
        responses = await asyncio.gather(*requests)
        for result in responses:
            try:
                steamid = result["data"]["steamid"]
                games = result["data"]["games"]
                message.payload.update({steamid: dict()})
                for id, game in games.items():
                    message.payload[steamid].update({id: game["playtime_forever"]})
            except:
                continue

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        friendlist = await get_friend_list(
            userid,
            key=request.args.get("key"),
            session=session,
            custom_req_data={"userid": userid},
        )

        requests = [
            get_owned_games(
                friend["steamid"],
                key=request.args.get("key"),
                include_played_free_games=1,
                session=session,
                custom_req_data={"userid": friend["steamid"]},
            )
            for friend in friendlist["data"]
        ]

        message = await set_payload_from_requests(
            message,
            requests,
            set_callback,
        )
    return message


@api.route("/friends/<userid>/gamerscore", methods=["GET"])
@broker.ping()
async def get_friends_achievement_score_leaderboard(userid):
    async def set_callback(message: RedisMessage, requests):
        responses = await asyncio.gather(*requests)
        for result in responses:
            message.payload.update({result["data"]["steamid"]: result["data"]["score"]})

    message = RedisMessage(
        RedisMessageType.LEADERBOARD_ACHIEVEMENTS_SCORE.value, userid
    )

    async with AsyncClient(limits=DEFAULT_API_CLIENT_LIMITS) as session:
        friendlist = await get_friend_list(
            userid,
            key=request.args.get("key"),
            session=session,
            custom_req_data={"userid": userid},
        )
        requests = [
            get_achievement_score(
                friend["steamid"],
                key=request.args.get("key"),
                session=session,
                custom_req_data={"userid": friend["steamid"]},
            )
            for friend in friendlist["data"][7:10]
        ]

        message = await set_payload_from_requests(
            message,
            requests,
            set_callback,
        )

    print("Sending request", file=stderr)
    # publish message to Redis
    reqid = await send_request(message)
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)

    # publish message to Redis
    return dataclasses.asdict(response)


@api.route("/friends/<userid>/playtime", methods=["GET"])
async def get_friends_playtime_leaderboard(userid):
    message = await _set_payload_with_playtimes(
        userid, RedisMessage(RedisMessageType.LEADERBOARD_PLAYTIME.value, userid)
    )
    print("Sending request", file=stderr)
    # publish message to Redis
    reqid = await send_request(message)
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)

    return dataclasses.asdict(response)


@api.route("/friends/<userid>/versatility", methods=["GET"])
async def get_friends_versatility_score_leaderboard(userid):
    message = await _set_payload_with_playtimes(
        userid,
        RedisMessage(RedisMessageType.LEADERBOARD_VERSATILITY_SCORE.value, userid),
    )
    # publish message to Redis
    print("Sending request", file=stderr)
    # publish message to Redis
    reqid = await send_request(message)
    # add channel to kwargs when implementing auth
    print("Request sent with id ", reqid, file=stderr)

    response = await get_response(userid)

    # publish message to Redis
    return dataclasses.asdict(response)
