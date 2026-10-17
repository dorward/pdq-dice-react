FROM node:lts-alpine AS dependencies
RUN npm install --global pnpm@12.6.0

RUN apk add --no-cache \
  fontconfig \
  ttf-dejavu \
  freetype \
  && mkdir -p /etc/fonts/conf.d

RUN mkdir -p /usr/app && chown node:node /usr/app
WORKDIR /usr/app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY fonts ./fonts
USER node
RUN pnpm install --frozen-lockfile

FROM dependencies AS development
COPY src ./src
COPY nodemon.json ./
USER node
EXPOSE 5101
CMD ["pnpm", "run", "start:development"]

FROM dependencies AS build
COPY src ./src
RUN pnpm run build && pnpm prune --prod

FROM node:lts-alpine AS production
RUN apk add --no-cache fontconfig ttf-dejavu freetype \
    && mkdir -p /var/pdq/avatars \
    && chown node:node /var/pdq/avatars
WORKDIR /usr/app
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/fonts ./fonts
ENV NODE_ENV=production
USER node
EXPOSE 5101
CMD ["node", "dist/app.js"]
