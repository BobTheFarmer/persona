FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/script/migrate.cjs ./script/migrate.cjs
COPY --from=build /app/package.json ./package.json
USER node
EXPOSE 5000
CMD ["sh", "-c", "node script/migrate.cjs && npm start"]
