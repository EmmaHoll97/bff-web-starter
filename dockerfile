# ---- Build ----
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

COPY . .
RUN npm run build

# ---- Production ----
FROM node:24-alpine
WORKDIR /app

# Only the server workspace + production deps
COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm ci --workspace server --omit=dev

# Grab the server source and client build artifacts
COPY --from=build /app/server/src ./server/src
COPY --from=build /app/server/public ./server/public

EXPOSE 8080
CMD ["npm", "start"]
