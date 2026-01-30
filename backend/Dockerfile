# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production

# Copy built files from the build stage
COPY --from=build /app/dist ./dist

# Create the directory for the database file
RUN mkdir -p db

# Expose the port the NestJS app runs on (default 3000)
EXPOSE 3000

CMD ["node", "dist/main.js"]
