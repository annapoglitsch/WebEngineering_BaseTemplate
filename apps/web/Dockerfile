
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps ./apps

RUN npm ci
RUN npm run build --workspace=@project/web

FROM nginx:alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 3000
