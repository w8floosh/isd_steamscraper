#!/bin/bash
PROVISION_MARKER="/usr/local/etc/redis/provisioned"

redis-server /usr/local/etc/redis/redis.conf &
# Wait for Redis server to start
until redis-cli ping &>/dev/null; do
  echo "Waiting for Redis to start..."
  sleep 1
done

# # Run your Redis commands
if [ ! -e "$PROVISION_MARKER" ]; then
    redis-cli XGROUP CREATE requests backend_cg $ MKSTREAM
    redis-cli XTRIM requests MAXLEN ~ 50000
    touch "$PROVISION_MARKER"
fi

tail -f /dev/null