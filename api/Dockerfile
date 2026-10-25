# ---- build ----
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# DATABASE_URL is only a placeholder so the Prisma config can load during generate
RUN DATABASE_URL="postgresql://x:x@localhost:5432/x" npx prisma generate && npm run build

# ---- run ----
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma7.config.ts ./
EXPOSE 4000
CMD ["node", "dist/server.js"]
