FROM node:14-alpine
ENV NODE_ENV=production
RUN apk update && apk add python3 make g++

# Set up core
WORKDIR /usr/src/app/
COPY ./*.json ./
COPY ./shared ./

# Set up server

EXPOSE 3001
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

COPY ["./packages/server/", "./packages/server/"]

# TODO set up client

####
####
####

# Copy to image

WORKDIR /usr/src/app/
RUN chown -R node /usr/src/app
USER node

# Start

WORKDIR /usr/src/app/packages/server/
CMD npm run start:dist:dev
