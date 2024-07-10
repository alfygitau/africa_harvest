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

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]

# # Use the latest version of the official Nginx image as the base image
# FROM nginx:latest
# # copy the custom nginx configuration file to the container in the default
# # location
# COPY nginx.conf /etc/nginx/nginx.conf
# # copy the built application from the build stage to the nginx html
# # directory
# COPY --from=build /app/dist/africa_harvest /usr/share/nginx/html

# EXPOSE 80
# EXPOSE 443

# CMD ["nginx", "-g", "daemon off;"]









