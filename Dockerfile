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
RUN pnpm exec prisma generate

# Build the web application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/prisma ./apps/web/prisma
COPY --from=builder /app/apps/web/node_modules/.prisma ./apps/web/node_modules/.prisma

# Expose port
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Start the application
WORKDIR /app/apps/web
CMD ["node", "server.js"]
