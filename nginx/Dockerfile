FROM nginx:latest

ARG certname=steamscraper

COPY default.conf /etc/nginx/conf.d/default.conf
COPY certificates/. /etc/ssl/certs
RUN find /etc/ssl/certs -name "${certname}*" -exec chmod 750 {} +

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
