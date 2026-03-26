FROM node:18-alpine AS alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable pnpm

FROM alpine AS builder
WORKDIR /app
RUN pnpm install turbo --global
COPY . .
RUN turbo prune api --docker

FROM alpine AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=api...

FROM alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app .

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
