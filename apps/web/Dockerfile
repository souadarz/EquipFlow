# ---- BASE ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- BUILDER ----
FROM base AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune web --docker

# ---- INSTALLER ----
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

# Variables d'environnement build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm turbo run build --filter=web...

# ---- RUNNER ----
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app .

EXPOSE 3000
ENV PORT=3000

CMD ["pnpm", "run", "start", "--filter=web"]