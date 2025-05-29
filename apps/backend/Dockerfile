FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm@10.6.3
RUN pnpm install
COPY src ./src
EXPOSE 3001
CMD ["pnpm", "dev"]