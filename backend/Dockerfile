FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci


FROM dependencies AS builder

COPY . .
RUN npm run build


FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]