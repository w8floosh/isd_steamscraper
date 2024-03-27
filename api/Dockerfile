FROM node:18 AS CLIENT_BUILD

COPY package.json /tmp
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app/api && cp -a /tmp/node_modules /usr/src/app/api

WORKDIR /usr/src/app/api

COPY . .
RUN npm run build

CMD [ "npm", "run", "start:prod"]
