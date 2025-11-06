# Tech Stack

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|-----------|---------|---------|-----------|
| **Frontend Language** | TypeScript | ^5.6.0 | Type-safe frontend development | Industry standard for large-scale React apps, prevents runtime errors |
| **Frontend Framework** | Next.js | ^15.0.0 | Web application framework | React 19 support, Turbopack dev server, App Router, SSR/SSG for SEO |
| **UI Component Library** | shadcn/ui | latest | Accessible UI components | Copy-paste components, full customization, Radix UI foundation, Tailwind integration |
| **CSS Framework** | Tailwind CSS | ^4.0.0 | Utility-first styling | Oxide engine (10x faster builds), rapid prototyping, consistency |
| **State Management** | Zustand | ^4.5.0 | Client-side state | Minimal boilerplate, React 19 compatible, better perf than Context API |
| **Backend Language** | TypeScript | ^5.6.0 | Type-safe backend development | Same language as frontend, shared types via monorepo |
| **Backend Framework** | Next.js API Routes | ^15.0.0 | Serverless API endpoints | Unified codebase with frontend, automatic deployment on Vercel |
| **API Style** | tRPC | ^10.45.0 | Type-safe API layer | End-to-end type safety, auto-generated client, eliminates API contracts |
| **Database (Production)** | PostgreSQL | 16 | Relational database | ACID compliance, JSON support, mature ecosystem |
| **Database (Local)** | SQLite | 3 | Local development DB | Zero config, fast tests, Drizzle supports both |
| **ORM** | Drizzle ORM | ^0.33.0 | Database abstraction | Lightweight, SQL-like queries, dual DB support, Edge Runtime compatible |
| **Cache** | Redis | 7 | Session and response cache | Sub-millisecond latency, BullMQ job queue support |
| **Vector DB** | Pinecone | Serverless | AI embeddings storage | Managed service, OpenAI integration, semantic search for product catalog |
| **File Storage** | Vercel Blob + S3 | latest | Product images, documents | Vercel Blob for CDN delivery, S3 for backup |
| **Authentication** | NextAuth.js | ^4.24.0 | User authentication (Phase 2) | OAuth 2.0, session management, Next.js integration |
| **Frontend Testing** | Vitest | ^1.0.0 | Unit/integration tests | Vite-powered, faster than Jest, ESM native |
| **Backend Testing** | Vitest | ^1.0.0 | API endpoint tests | Same tool as frontend for consistency |
| **E2E Testing** | Playwright | ^1.40.0 | End-to-end tests | Cross-browser, auto-wait, also used for scraping |
| **Build Tool** | Turborepo | ^2.0.0 | Monorepo build orchestration | Incremental builds, remote caching, task pipelines |
| **Bundler** | Turbopack | (Next.js 15) | Development bundler | 10x faster than Webpack, built into Next.js 15 |
| **Package Manager** | pnpm | ^8.0.0 | Dependency management | Faster installs, disk space efficient, monorepo friendly |
| **IaC Tool** | AWS SAM / Serverless | ^3.0.0 | Lambda deployment | YAML-based infrastructure, local testing, CI/CD integration |
| **CI/CD** | GitHub Actions | latest | Automated testing and deployment | Free for public repos, Vercel integration, AWS deployment |
| **Monitoring** | Sentry | ^7.91.0 | Error tracking | Real-time alerts, stack traces, release tracking |
| **Analytics** | Vercel Analytics | ^1.1.0 | Web Vitals tracking | Built-in, zero config, privacy-friendly |
| **Logging** | Winston + CloudWatch | ^3.11.0 | Structured logging | JSON logs, multiple transports, AWS integration |
| **AI - Primary** | OpenAI API | ^4.20.0 | GPT-4 Turbo for chatbot, CS | Best-in-class quality, fast responses, cost-effective |
| **AI - Fallback** | Anthropic Claude | ^0.12.0 | Claude 3 Haiku backup | Reliability, 200k context window for long reviews |
| **AI Orchestration** | LangChain | ^0.1.0 | RAG workflows (Phase 2) | Vector DB integration, prompt templates, agents |
| **Job Queue** | BullMQ | ^5.0.0 | Scheduled monitoring tasks | Redis-based, retries, priorities, UI dashboard |
| **Web Scraping** | Playwright | ^1.40.0 | E-commerce monitoring | Headless browser, auto-wait, multi-browser |
| **Notifications** | Slack SDK | ^7.0.0 | Alerts and notifications | Webhooks for crisis alerts, lead notifications |

---
