FROM python:latest
ARG pwd=insert_password_here
RUN pip install aioredis quart && mkdir -p /usr/src/app/ && sudo useradd -m quart -u 3001 &&  sudo chpasswd quart:$

COPY ./steamapi /usr/src/app/

EXPOSE 443 3001

WORKDIR /usr/src/app

ENTRYPOINT [ "python3" ]
#CMD ["-m", "celery", "-A", "api", "worker", "--loglevel=info", "--uid=3001"]
CMD ["-m", "quart", "run"]
