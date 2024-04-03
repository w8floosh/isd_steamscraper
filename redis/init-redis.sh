#!/bin/bash

PROVISION_MARKER="$HOME/etc/provisioned"
whoami
redis-server --save 20 1 --loglevel warning --protected-mode no \
  --loadmodule /opt/redis-stack/lib/redisearch.so \
  --loadmodule /opt/redis-stack/lib/rejson.so &
# Wait for Redis server to start
until redis-cli ping &>/dev/null; do
  echo "Waiting for Redis to start..."
  sleep 1
done

# # Run your Redis commands
if [ ! -e "$PROVISION_MARKER" ]; then
    redis-cli XGROUP CREATE requests backend_cg $ MKSTREAM
    redis-cli XTRIM requests MAXLEN 1000
    mkdir -p "$HOME/etc"
    touch "$PROVISION_MARKER"
fi

tail -f /dev/null