# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Build the NestJS project
RUN npm run build

# Expose backend port
EXPOSE 3001

# Start the app
CMD ["npm", "run", "start:dev"]