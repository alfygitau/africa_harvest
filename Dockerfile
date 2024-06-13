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

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/build/browser /usr/share/nginx/html

# This line is IMPORTANT, we will breakdown it on a minute.
COPY ./entrypoint.sh /app/entrypoint.sh

# Copy the nginx conf that we created to the container
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443 6006 4200

RUN chmod +x /usr/local/app/entrypoint.sh
ENTRYPOINT [ "/usr/local/app/entrypoint.sh" ]









