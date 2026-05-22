# LuxeCart API — production image
FROM node:20-alpine

WORKDIR /app

# Install deps (incl. dev deps needed for prisma generate + tsc build + tsx seed)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production
EXPOSE 4000

# Apply pending migrations, then start the compiled server.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
