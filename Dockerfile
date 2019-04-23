FROM node:alpine

ADD . /dy

RUN cd /dy && npm install

WORKDIR /dy/server

EXPOSE 8081

CMD node server.js
