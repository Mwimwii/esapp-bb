FROM node:14

ARG GITHUB_ACCESS_TOKEN

WORKDIR /app

RUN mkdir -p /app/node_modules /app/dist
RUN chown -R node:node /app/node_modules /app/dist

COPY --chown=node:node package.json yarn.lock ./

RUN echo "//npm.pkg.github.com/:_authToken=${GITHUB_ACCESS_TOKEN}" >> /app/.npmrc

RUN yarn install

COPY --chown=node:node . .

USER node

RUN yarn build

CMD ["node", "./dist/index.js"]
