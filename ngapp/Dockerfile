FROM node:24-alpine AS build
WORKDIR /app
ARG PUBLIC_API_URL=http://localhost:4000/api
COPY package*.json ./
RUN npm ci
COPY . .
RUN sed -i "s|http://localhost:4000/api|${PUBLIC_API_URL}|g" src/environments/environment.ts \
 && npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ngapp/browser /usr/share/nginx/html
EXPOSE 80
