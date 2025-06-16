FROM node:18.20.4-slim
WORKDIR /app
COPY apps/backend/package.json ../../pnpm-lock.yaml ./
RUN npm install -g pnpm@10.6.3
RUN pnpm install --prod

COPY apps/backend/src/ ./src/
EXPOSE 3001
CMD ["node", "src/server.js"]