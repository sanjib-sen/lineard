# ARG LINEAR_WEBHOOK_SECRET
# ARG DISCORD_WEBHOOK_URL

ARG PORT=3000

FROM node:alpine as build

WORKDIR /lineard
COPY package.json package.json
RUN npm install --omit=dev
COPY --chown=node:node . .
RUN npm install -D typescript && npm run build && npm uninstall typescript


FROM node:alpine as production

WORKDIR /lineard
COPY --chown=node:node --from=build /lineard/node_modules /lineard/node_modules
COPY --chown=node:node --from=build /lineard/dist /lineard/dist
EXPOSE 3000
CMD [ "node", "dist/index.js" ]