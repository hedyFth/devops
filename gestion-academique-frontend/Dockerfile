# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Run stage (Nginx) ----
FROM nginx:alpine
# Angular (builder @angular/build:application) sort généralement dans dist/<app>/browser
COPY --from=build /app/dist/gestion-academique-frontend/browser /usr/share/nginx/html

# Nginx config (SPA + proxy /api)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
