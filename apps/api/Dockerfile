
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps ./apps

RUN npm ci
RUN npm run build --workspace=@project/api

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm ci --omit=dev --workspace=@project/api --ignore-scripts
COPY --from=build /app/apps/api/dist ./apps/api/dist

EXPOSE 3001
CMD ["npm", "run", "start", "--workspace=@project/api"]
