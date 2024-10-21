# Stage 1: Build the application
FROM node:12-alpine AS builder

# Set environment variables
ENV PORT=5000
ARG CLIENT_ID

WORKDIR /app

# Install dependencies needed for building the application
RUN apk add --no-cache \
  autoconf \
  automake \
  bash \
  g++ \
  libc6-compat \
  libjpeg-turbo-dev \
  libpng-dev \
  make \
  nasm 

# Copy package files first to leverage Docker cache
COPY package*.json ./
RUN npm install --production --silent

# Copy the rest of the application code
COPY . .

# Build production client side React application
RUN npm run build

# Stage 2: Create the final image
FROM node:12-alpine

# Set environment variables
ENV PORT=5000

WORKDIR /app

# Copy only the built files and necessary dependencies from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# Expose port for Node
EXPOSE $PORT

# Start Node server
CMD ["npm", "run", "prod"]
