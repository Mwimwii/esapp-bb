FROM node:14

WORKDIR /app

COPY package.json yarn.lock ./

COPY . .

RUN yarn install && yarn build

USER node

CMD ["node", "./dist/server.js"]
