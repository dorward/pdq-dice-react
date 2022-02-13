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
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++
ENV PYTHON=python3
RUN npm install \
    && apk del .gyp

WORKDIR /usr/src/app/
COPY ["./packages/server/", "./packages/server/"]
COPY ["./shared/types/", "./packages/server/src/types/"]

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
RUN npm install
CMD npm run start:dist:dev
