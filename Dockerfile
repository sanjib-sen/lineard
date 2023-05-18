
FROM node:alpine

RUN mkdir -p /lineard/node_modules && chown -R node:node /lineard && chown -R node:node /lineard

WORKDIR /lineard

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build && npm prune --production

EXPOSE 3000

CMD [ "node", "dist/index.js" ]