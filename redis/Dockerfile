FROM redis/redis-stack-server:latest

# Copy a script into the image
COPY init-redis.sh /usr/local/bin/init-redis.sh
# Set execute permissions on the script
RUN chmod 755 /usr/local/bin/init-redis.sh
# Run the script when the container starts
CMD ["init-redis.sh"]


# RUN firewall-cmd --permanent --new-zone=redis --add-port=6379/tcp --add-source=$STEAMAPI && \
#     firewall-cmd --permanent --new-zone=redis --add-port=6379/tcp --add-source=$BACKEND && \
#     firewall-cmd -reload
    

