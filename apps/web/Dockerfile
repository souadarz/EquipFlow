FROM node:18-alpine AS alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable pnpm

FROM alpine AS builder
WORKDIR /app
RUN pnpm install turbo --global
COPY . .
RUN turbo prune web --docker

FROM alpine AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

# Variables d'environnement
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN pnpm turbo run build --filter=web...

FROM alpine AS runner
WORKDIR /app
RUN corepack enable pnpm

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app .

EXPOSE 3000

ENV PORT=3000
CMD ["pnpm", "run", "start", "--filter=web"]
