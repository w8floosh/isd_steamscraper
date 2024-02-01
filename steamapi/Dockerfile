FROM python:latest

RUN pip install celery redis flask && mkdir -p /usr/src/app/ && adduser celery -u 3001

COPY ./steamapi /usr/src/app/

EXPOSE 443 3001

WORKDIR /usr/src/app

ENTRYPOINT [ "python3" ]
#CMD ["-m", "celery", "-A", "api", "worker", "--loglevel=info", "--uid=3001"]
CMD ["-m", "steamapi"]
