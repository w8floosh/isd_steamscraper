import json, asyncio
from os import environ
from steamapi.broker.utils import redis_init

_loginfile = open("login.json")

# _loginfile = open(environ.get("REDIS_LOGIN"))
_login = json.loads(_loginfile.read())
_loginfile.close()

broker = asyncio.new_event_loop().run_until_complete(redis_init(_login))
