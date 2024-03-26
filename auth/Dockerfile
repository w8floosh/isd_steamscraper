FROM node:18

ARG certname=server
COPY src/certificates /etc/ssl/certs
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app/auth && cp -a /tmp/node_modules /usr/src/app/auth

WORKDIR /usr/src/app/auth
COPY . .
RUN npm run build
# COPY .env.prod .

RUN find /etc/ssl/certs -name "${certname}*" -exec chmod 750 {} +

CMD ["npm", "run", "start:prod"]
