FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package.json backend/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy backend source code
COPY backend/ .

# Copy Prisma schema from root
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate --schema ./db/schema.prisma

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
