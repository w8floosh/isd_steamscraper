FROM redis/redis-stack-server:latest

# RUN firewall-cmd --permanent --new-zone=redis --add-port=6379/tcp --add-source=$STEAMAPI && \
#     firewall-cmd --permanent --new-zone=redis --add-port=6379/tcp --add-source=$BACKEND && \
#     firewall-cmd -reload
#RUN sed -i 's/protected-mode yes/protected-mode no/g' /opt/redis-stack/etc/redis.conf 

RUN echo "CONFIG SET timeout 300" | redis-cli


