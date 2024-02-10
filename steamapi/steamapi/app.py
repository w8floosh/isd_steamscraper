from quart import Quart

import steamapi.api.stats as stats
import steamapi.api.misc as misc
import steamapi.api.store as store
import steamapi.api.users as users
import steamapi.api.leaderboards as leaderboards
import steamapi.api.user_stats as user_stats


server = Quart(__name__)
server.register_blueprint(stats.api)
server.register_blueprint(misc.news)
server.register_blueprint(store.api)
server.register_blueprint(users.api)
server.register_blueprint(leaderboards.api)
server.register_blueprint(user_stats.api)
