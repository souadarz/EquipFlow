# ---- BASE IMAGE ----
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- BUILDER ----
FROM base AS builder
WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune api --docker

# ---- INSTALLER ----
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

# Build de l'API
RUN pnpm turbo run build --filter=api...

# ---- RUNNER ----
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app .

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]