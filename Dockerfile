FROM node:alpine

WORKDIR /app

COPY dist /app/public
COPY server/index.js /app/server.js

RUN adduser -h /app -s /sbin/nologin -D ctf && \
    yarn config set registry https://registry.npm.taobao.org && \
    yarn add koa koa-route koa-static koa-websocket && \
    chown -R root:root /app && \
    chmod -R 755 /app

CMD ["su","-s","/bin/sh","ctf","-c","node server.js"]