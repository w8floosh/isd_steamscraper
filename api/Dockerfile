FROM node:18 AS CLIENT_BUILD

WORKDIR /usr/src/app/api

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD [ "npm", "run", "start:prod"]
