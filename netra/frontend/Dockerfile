FROM node:20-alpine AS builder

WORKDIR /app
ARG DATABASE_URL=postgresql://user:password@localhost:5432/netra

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema ./db/schema.prisma
RUN npm run build

FROM node:20-alpine

WORKDIR /app
ARG DATABASE_URL=postgresql://user:password@localhost:5432/netra

COPY package.json package-lock.json ./
COPY db ./db

RUN npm ci && \
    npx prisma generate --schema ./db/schema.prisma && \
    npm prune --omit=dev

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
