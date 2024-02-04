FROM python:latest

RUN pip install -U celery[redis] redis && mkdir -p /usr/src/app/ && adduser celery -u 3001

COPY ./api /usr/src/app/

EXPOSE 3001

WORKDIR /usr/src/app

ENTRYPOINT [ "python3" ]
CMD ["-m", "celery", "-A", "api", "worker", "--loglevel=info", "--uid=3001"]
