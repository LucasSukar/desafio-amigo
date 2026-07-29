FROM node:22-alpine AS development

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build 2>/dev/null || npx sucrase ./src -d ./build --transforms imports

FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/build ./build
COPY --from=builder /app/index.js ./index.js

EXPOSE 3333

CMD ["node", "build/app.js"]
