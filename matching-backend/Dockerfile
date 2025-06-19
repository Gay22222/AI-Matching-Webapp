FROM node:20.19.0

RUN npm install -g pnpm@10.6.3

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

COPY .env ./

RUN npx prisma generate

EXPOSE 3001

CMD ["node", "src/server.js"]