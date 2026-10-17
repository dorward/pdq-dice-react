FROM node:lts-alpine
RUN npm install --global pnpm@12.6.0

RUN apk add --no-cache \
  fontconfig \
  ttf-dejavu \
  freetype \
  && mkdir -p /etc/fonts/conf.d

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY src ./src
COPY fonts ./fonts
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
RUN pnpm install --frozen-lockfile

EXPOSE 5101
CMD /wait && pnpm run "start:$NODE_ENV"
