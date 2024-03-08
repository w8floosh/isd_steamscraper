FROM redis/redis-stack-server:latest

# Copy a script into the image
COPY init-redis.sh /usr/local/bin/init-redis.sh
COPY redis.conf /usr/local/etc/redis/redis.conf
# Set execute permissions on the script
RUN chmod +x /usr/local/bin/init-redis.sh
RUN echo '\nprotected-mode no' >> /opt/redis-stack/etc/redis-stack.conf 
RUN echo '\ntimeout 300' >> /opt/redis-stack/etc/redis-stack.conf 
# Run the script when the container starts
CMD ["init-redis.sh"]


# RUN firewall-cmd --permanent --new-zone=redis --add-port=6379/tcp --add-source=$STEAMAPI && \
#     firewall-cmd --permanent --new-zone=redis --add-port=6379/tcp --add-source=$BACKEND && \
#     firewall-cmd -reload
    

