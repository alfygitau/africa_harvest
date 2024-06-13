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

### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest AS ngi
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 
COPY --from=build /dist/src/app/dist/africa_harvest /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]









