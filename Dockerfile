FROM node:14-alpine
ENV NODE_ENV=production
RUN apk update && apk add python3 make g++

# Set up server

WORKDIR /usr/src/app/packages/server/
COPY ./packages/server/package*.json ./
# RUN npm install --production && npm rebuild sqlite3 --build-from-source && npm cache clean --force  && mv node_modules ../
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++
ENV PYTHON=python3
RUN npm install \
    && apk del .gyp

# TODO set up client

# Go

WORKDIR /usr/src/app/
COPY ["./packages/server/", "./"]

EXPOSE 3001
RUN chown -R node /usr/src/app
USER node
CMD npm run start:dist:dev
