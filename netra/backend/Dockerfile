FROM node:20-alpine

WORKDIR /app
ARG DATABASE_URL=postgresql://user:password@localhost:5432/netra

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema ./db/schema.prisma && \
    npm prune --omit=dev

EXPOSE 5000

CMD ["npm", "start"]
