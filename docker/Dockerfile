FROM node:14

ARG GITHUB_ACCESS_TOKEN

WORKDIR /app

RUN mkdir -p /app/node_modules /app/dist
RUN chown -R node:node /app/node_modules /app/dist

COPY --chown=node:node package.json yarn.lock ./

COPY --chown=node:node . .

RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_ACCESS_TOKEN}" >> /app/.npmrc

RUN yarn install

USER node

RUN yarn build

RUN npx typeorm schema:sync

CMD ["node", "./dist/index.js"]
