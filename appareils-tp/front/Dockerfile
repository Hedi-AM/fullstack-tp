# ---- stage 1: build the Angular app ----
FROM node:24-alpine AS build
WORKDIR /app
ARG PUBLIC_API_URL=http://192.168.122.180:3002/api
COPY package*.json ./
RUN npm ci
COPY . .
RUN printf "export const environment = {\n  apiUrl: '%s/appareils',\n  roomsUrl: '%s/rooms',\n};\n" "$PUBLIC_API_URL" "$PUBLIC_API_URL" > src/environments/environment.ts
RUN npm run build

# ---- stage 2: serve with nginx ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/front/browser /usr/share/nginx/html
EXPOSE 80
