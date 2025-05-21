# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build Next.js app for production
RUN npm run build

# Expose frontend port (default 3000)
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "dev"]
