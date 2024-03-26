FROM node:18 AS CLIENT_BUILD


COPY . /usr/src/app/api
WORKDIR /usr/src/app/api
RUN npm install && npm run build

CMD [ "npm", "run", "start:prod"]
