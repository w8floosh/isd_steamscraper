import json
from os import environ


from ..broker.types import RedisManager

_loginfile = open("login.json")

# _loginfile = open(environ.get("REDIS_LOGIN"))
_login = json.loads(_loginfile.read())
_loginfile.close()

broker = RedisManager(_login)
