# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

# Copy all package.json files first for better caching
COPY packages/config/package.json packages/config/
COPY packages/shared/package.json packages/shared/
COPY packages/ui/package.json packages/ui/
COPY apps/web/package.json apps/web/

# Install dependencies for entire monorepo
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY packages/ packages/
COPY apps/web/ apps/web/

# Generate Prisma client
WORKDIR /app/apps/web
ENV DATABASE_URL="file:./dev.db"
RUN pnpm exec prisma generate

# Build the web application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Copy public folder
COPY --from=builder /app/apps/web/public ./apps/web/public

# Copy standalone output
COPY --from=builder /app/apps/web/.next/standalone ./

# Copy static files
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Copy Prisma files
COPY --from=builder /app/apps/web/node_modules/.prisma ./apps/web/node_modules/.prisma
COPY --from=builder /app/apps/web/prisma ./apps/web/prisma

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "apps/web/server.js"]
