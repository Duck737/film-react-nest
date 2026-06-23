FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci


FROM dependencies AS builder

COPY . .

ARG VITE_API_URL
ARG VITE_CDN_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build


FROM alpine:3.20 AS exporter

WORKDIR /output

COPY --from=builder /app/dist /build

VOLUME ["/output"]

CMD ["sh", "-c", "rm -rf /output/* && cp -a /build/. /output/"]