FROM python:latest

RUN pip install --upgrade pip
WORKDIR /usr/src/app/steamapi

COPY steamapi .
RUN chmod 755 -R . && pip install -r requirements.txt
CMD ["quart", "run"]
