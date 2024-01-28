#
# NOTE: THIS DOCKERFILE IS GENERATED VIA "update.sh"
#
# PLEASE DO NOT EDIT IT DIRECTLY.
#
FROM node:18 AS CLIENT_BUILD

COPY . /usr/src/app/client
RUN cd /usr/src/app/client && npm install && npm run build

FROM nginx:latest

COPY --from=CLIENT_BUILD /usr/src/app/client/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
