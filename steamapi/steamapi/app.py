from sys import stderr
from quart import Quart
from quart.logging import getLogger
from .api.stats import api as stats
from .api.misc import news as misc

from .api.store import api as store

from .api.users import api as users

from .api.leaderboards import api as leaderboards
from .api.user_stats import api as user_stats

server = Quart(__name__)
server.register_blueprint(stats)
server.register_blueprint(misc)
server.register_blueprint(store)
server.register_blueprint(users)
server.register_blueprint(leaderboards)
server.register_blueprint(user_stats)
logger = getLogger()


@server.before_serving
async def redis_startup():
    from .broker import broker

    try:
        await broker.connect()
    except Exception as e:
        logger.error(f"Redis startup failed with error: {e}")
