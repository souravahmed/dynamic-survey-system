# Use a Node base image
FROM node:20-alpine AS development

WORKDIR /app

# Copy package.json files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Vite default port is 5173
EXPOSE 5173

# Start the Vite development server. We use "--host 0.0.0.0" 
# so it is accessible outside the container network.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
