# Stage 1: Build the Angular application
FROM node:20.14.0-alpine as build

WORKDIR /app

# instaa the cli
RUN npm install -g @angular/cli@13

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the source code and build the application
COPY . .
RUN npm run build

# EXPOSE 4200

# CMD ["ng", "serve", "--host", "0.0.0.0"]

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the Angular app build output to Nginx's default public directory
COPY --from=build /app/dist/africa_harvest /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]









