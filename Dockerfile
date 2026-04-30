FROM node:20-alpine AS build
WORKDIR /app
COPY vue-project/package*.json ./
RUN npm ci
COPY vue-project/ ./
RUN npm run build


FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html/
COPY vue-project/nginx.conf /etc/nginx/conf.d/default.conf