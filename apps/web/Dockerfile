# Base image with Node.js
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
COPY ../../pnpm-workspace.yaml ../../pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/.env ./.env

# Copy messages for i18n
COPY --from=builder /app/messages ./messages

USER nextjs

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
