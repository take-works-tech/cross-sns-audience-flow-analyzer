# syntax=docker/dockerfile:1.7
# multi-stage Node.js image for cross-sns-audience-flow-analyzer.
# deps -> build -> runtime. Runtime uses node:20-alpine, dumb-init,
# and a non-root user.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runtime
RUN apk add --no-cache dumb-init \
 && addgroup -S -g 1001 appgroup \
 && adduser  -S -u 1001 -G appgroup appuser
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/dist        ./dist
COPY --from=build --chown=appuser:appgroup /app/package.json ./package.json
USER appuser
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
