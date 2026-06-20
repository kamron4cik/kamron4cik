FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY frontend/app/package*.json ./
RUN npm ci

# Copy the rest of the app and build
COPY frontend/app/ ./
RUN npm run build

# Serve with Nginx
FROM nginx:alpine
RUN sed -i 's/worker_processes  auto;/worker_processes  1;/' /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
