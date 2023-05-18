ARG LINEAR_WEBHOOK_SECRET
ARG DISCORD_TOKEN
ARG DISCORD_CHANNEL_ID
ARG PORT

FROM node:alpine as build

RUN mkdir -p /lineard/node_modules && chown -R node:node /lineard && chown -R node:node /lineard

WORKDIR /lineard

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN npm run build



FROM node:alpine as production

WORKDIR /lineard

COPY --chown=node:node --from=build /lineard/node_modules /lineard/node_modules

COPY --chown=node:node --from=build /lineard/dist /lineard/dist

USER node

EXPOSE 3000

CMD [ "node", "dist/index.js" ]