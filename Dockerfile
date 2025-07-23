# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript to JavaScript
RUN npx tsc

# Stage 2: Run
FROM node:18

WORKDIR /app

# Copy production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled app files
COPY --from=builder /app/dist ./dist


EXPOSE 3000


CMD ["node", "dist/server.js"]
