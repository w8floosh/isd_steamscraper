from flask import Flask
from api.economy import api as api_economy
from api.stats import api as api_stats
from api.misc import news as api_news
from api.users import api as api_users
from api.store import api as api_store

if __name__ == "__main__":
    server = Flask(__name__)
    server.register_blueprint(api_economy)
    server.register_blueprint(api_stats)
    server.register_blueprint(api_news)
    server.register_blueprint(api_users)
    server.register_blueprint(api_store)
