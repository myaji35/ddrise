# Development Workflow

## Local Development Setup

### Prerequisites

```bash
# Required tools
node --version          # v20.10.0+
pnpm --version          # v8.0.0+
```

### Initial Setup

```bash
# Clone repository
git clone https://github.com/your-org/daedong-portal.git
cd daedong-portal

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Setup local database (SQLite)
pnpm db:push

# Seed database (optional)
pnpm db:seed
```

### Development Commands

```bash
# Start all services (Turborepo)
pnpm dev

# Start frontend only
pnpm dev --filter=web

# Start backend only (N/A for serverless, use Vercel dev)
pnpm dev --filter=monitoring-bot

# Run tests
pnpm test                    # All tests
pnpm test --filter=web       # Frontend tests only
pnpm test:e2e                # E2E tests

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Database commands
pnpm db:push                 # Push schema changes (dev)
pnpm db:migrate              # Run migrations (prod)
pnpm db:studio               # Drizzle Studio GUI
```

## Environment Configuration

### Required Environment Variables

```bash
# Frontend (.env.local - apps/web)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./sqlite.db"
REDIS_URL="redis://localhost:6379"

# AI APIs
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
PINECONE_API_KEY="..."
PINECONE_ENVIRONMENT="us-west1-gcp"

# External Services
SLACK_WEBHOOK_URL_SALES="https://hooks.slack.com/services/T.../B.../XXX"
SLACK_WEBHOOK_URL_CS="https://hooks.slack.com/services/T.../B.../YYY"

# NextAuth (Phase 2)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Backend (.env - apps/monitoring-bot)
DATABASE_URL="postgresql://user:password@localhost:5432/daedong"
OPENAI_API_KEY="sk-..."
SLACK_WEBHOOK_URL_CS="..."

# Shared (both)
NODE_ENV="development"
```

---
