# Stage 1: BUILD React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for dependency caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .

# Build with production API URL injected at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Stage 2: SERVE with Nginx
FROM nginx:alpine

# Copy built React files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]