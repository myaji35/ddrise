# 대동 (Daedong) AI-Powered Business Portal - Fullstack Architecture Document

**Version:** 1.0
**Date:** 2025-11-07
**Status:** Draft

---

## Introduction

This document outlines the complete fullstack architecture for **대동 (Daedong) AI-Powered Business Portal**, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

**Status:** Greenfield project

**Approach:**
- Start with Next.js 15+ starter template (create-next-app)
- Add shadcn/ui via CLI (`npx shadcn@latest init`)
- Configure Turborepo for monorepo structure
- No existing codebase constraints

**Key Initial Setup:**
```bash
# Create Next.js 15 app with TypeScript
npx create-next-app@latest daedong-portal --typescript --tailwind --app --src-dir

# Initialize shadcn/ui
cd daedong-portal
npx shadcn@latest init

# Convert to monorepo with Turborepo
npx create-turbo@latest --example with-nextjs
```

### Change Log

| Date       | Version | Description                        | Author  |
|------------|---------|-----------------------------------|---------|
| 2025-11-07 | 1.0     | Initial architecture document     | Winston |

---

## High Level Architecture

### Technical Summary

The Daedong AI-Powered Business Portal is built as a **modern fullstack serverless application** with a **dual-track architecture**. The system leverages **Next.js 15 App Router** for a unified frontend and API layer, deployed on **Vercel** for automatic scaling and global edge distribution. The backend utilizes a **hybrid serverless approach** with Vercel Functions for API endpoints and **AWS Lambda** for long-running tasks like web scraping.

**Track A (B2B Web Portal)** provides AI-powered lead generation through real-time personalization and intelligent chatbots, while **Track B (E-commerce Monitoring Engine)** automates customer service and competitive analysis through scheduled scraping and AI analysis. Data persistence uses **PostgreSQL** (production) and **SQLite** (local development) via **Drizzle ORM**, with **Redis** for session and response caching. AI capabilities are powered by **OpenAI GPT-4 Turbo** with **Claude 3 Haiku** as fallback, orchestrated through **tRPC** for end-to-end type safety.

This architecture achieves the PRD goals of 24/7 autonomous business operations, 90% CS automation, and sub-1-hour crisis response times through intelligent event-driven workflows and real-time monitoring.

### Platform and Infrastructure Choice

**Platform:** Hybrid (Vercel + AWS)

**Rationale:**
We evaluated three primary options:

1. **Vercel + AWS (Selected)**
   - ✅ Next.js native optimization on Vercel
   - ✅ Serverless Functions for API (10s timeout)
   - ✅ AWS Lambda for long-running tasks (15min timeout)
   - ✅ Best developer experience
   - ⚠️ Multi-platform complexity

2. **AWS Full Stack**
   - ✅ Single platform management
   - ✅ VPC security integration
   - ⚠️ Next.js deployment complexity (Amplify/ECS)
   - ⚠️ Worse DX compared to Vercel

3. **Vercel + Supabase**
   - ✅ Simplest setup
   - ✅ Built-in auth/storage
   - ⚠️ Limited customization for complex workflows
   - ⚠️ No long-running task support

**Selected Platform:** Hybrid (Vercel + AWS)

**Key Services:**
- **Frontend/API:** Vercel (Edge Network, Serverless Functions)
- **Long-running Tasks:** AWS Lambda (EventBridge triggers)
- **Database:** AWS RDS PostgreSQL (production), SQLite (local)
- **Cache:** AWS ElastiCache Redis
- **CDN:** Vercel Edge + CloudFront
- **AI Services:** OpenAI API, Anthropic API
- **Vector DB:** Pinecone (Serverless)
- **Monitoring:** Sentry, Vercel Analytics

**Deployment Host and Regions:**
- **Vercel:** Global Edge Network (automatic)
- **AWS:** ap-northeast-2 (Seoul) primary, ap-northeast-1 (Tokyo) backup

### Repository Structure

**Structure:** Monorepo

**Monorepo Tool:** Turborepo

**Rationale:**
- ✅ Unified codebase for web portal + monitoring bot + shared types
- ✅ Turborepo provides fast incremental builds
- ✅ Shared TypeScript types between frontend/backend via packages
- ✅ Single CI/CD pipeline
- ⚠️ Tradeoff: Initial setup complexity vs long-term maintainability

**Package Organization:**
```
apps/
  web/              # Next.js 15 web application (Track A)
  monitoring-bot/   # AWS Lambda scraping functions (Track B)
packages/
  shared/           # Shared TypeScript types, constants
  ui/               # Shared shadcn/ui components
  db/               # Drizzle ORM schema and migrations
  config/           # ESLint, TypeScript, Tailwind configs
```

### High Level Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Browser<br/>(Desktop/Mobile)"]
    end

    subgraph Vercel["Vercel Edge Network"]
        Edge["Edge Middleware<br/>(IP Detection, Personalization)"]
        CDN["Static Assets CDN"]
        NextApp["Next.js 15 App<br/>(SSR/SSG)"]
        API["API Routes<br/>(tRPC)"]
    end

    subgraph AI["AI Services"]
        OpenAI["OpenAI<br/>GPT-4 Turbo"]
        Claude["Claude 3<br/>Haiku"]
        Pinecone["Pinecone<br/>Vector DB"]
    end

    subgraph AWS["AWS Services"]
        Lambda["Lambda Functions<br/>(Monitoring Bot)"]
        EventBridge["EventBridge<br/>(10min schedule)"]
        RDS["RDS PostgreSQL"]
        ElastiCache["ElastiCache<br/>Redis"]
    end

    subgraph External["External Services"]
        Coupang["Coupang"]
        SmartStore["Smart Store"]
        Slack["Slack Webhooks"]
    end

    Browser -->|HTTPS| Edge
    Edge --> NextApp
    Edge --> CDN
    NextApp --> API
    API --> OpenAI
    API --> Claude
    API --> Pinecone
    API --> RDS
    API --> ElastiCache

    EventBridge -->|Trigger| Lambda
    Lambda -->|Scrape| Coupang
    Lambda -->|Scrape| SmartStore
    Lambda --> OpenAI
    Lambda --> RDS
    Lambda --> Slack

    RDS -.->|Read Cache| ElastiCache
```

### Architectural Patterns

- **Jamstack Architecture:** Static site generation with serverless APIs - _Rationale:_ Optimal performance and SEO for B2B lead generation while maintaining dynamic AI capabilities
- **Event-Driven Architecture:** Scheduled events trigger monitoring workflows - _Rationale:_ Decouples long-running scraping tasks from user-facing application for reliability
- **Backend for Frontend (BFF):** tRPC provides type-safe API layer - _Rationale:_ Eliminates API contract mismatches and accelerates development with auto-generated types
- **Repository Pattern:** Abstract data access via Drizzle ORM - _Rationale:_ Enables dual database strategy (SQLite/PostgreSQL) with identical codebase
- **Cache-Aside Pattern:** Redis caching for AI responses and session data - _Rationale:_ Reduces AI API costs by 30% and improves response times
- **Component-Based UI:** Reusable React 19 Server/Client Components - _Rationale:_ Leverages React Compiler for automatic optimization and reduces bundle size
- **Dual-Track Isolation:** Separate codepaths for B2B Portal vs E-commerce Engine - _Rationale:_ Independent scaling and deployment of business-critical vs operational workloads

---

## Tech Stack

### Technology Stack Table

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

## Data Models

### Lead (B2B Contact)

**Purpose:** Captures potential B2B partners and distributors identified through website interactions (chatbot, quote forms).

**Key Attributes:**
- `id`: UUID - Unique identifier
- `companyName`: string - Business name
- `contactName`: string - Contact person
- `email`: string - Email address (required)
- `phone`: string - Phone number (optional)
- `country`: string - Geographic location
- `industry`: string - Industry sector (e.g., "Construction", "Manufacturing")
- `inquiryType`: enum - '3M' | 'PowerTools' | 'Other'
- `message`: text - Initial inquiry message
- `source`: enum - 'chatbot' | 'quote-form' | 'contact-form'
- `status`: enum - 'new' | 'contacted' | 'qualified' | 'closed'
- `createdAt`: timestamp
- `updatedAt`: timestamp

#### TypeScript Interface

```typescript
export interface Lead {
  id: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  country?: string;
  industry?: string;
  inquiryType: 'chatbot' | 'quote-form' | 'contact-form';
  message?: string;
  source: 'chatbot' | 'quote-form' | 'contact-form';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Relationships
- One-to-many with `ChatbotConversation` (a lead can have multiple chat sessions)

---

### ChatbotConversation

**Purpose:** Logs all chatbot interactions for lead qualification analysis and AI training.

**Key Attributes:**
- `id`: UUID
- `sessionId`: string - Browser session identifier
- `leadId`: UUID - Foreign key to Lead (nullable until qualified)
- `userMessage`: text - User's message
- `botResponse`: text - AI-generated response
- `sentiment`: enum - 'positive' | 'neutral' | 'negative'
- `intent`: enum - 'inquiry' | 'quotation' | 'product-info' | 'other'
- `createdAt`: timestamp

#### TypeScript Interface

```typescript
export interface ChatbotConversation {
  id: string;
  sessionId: string;
  leadId?: string;
  userMessage: string;
  botResponse: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: 'inquiry' | 'quotation' | 'product-info' | 'other';
  createdAt: Date;
}
```

#### Relationships
- Many-to-one with `Lead`

---

### EcommerceReview

**Purpose:** Stores scraped customer reviews from e-commerce platforms for sentiment analysis and crisis detection.

**Key Attributes:**
- `id`: UUID
- `platform`: enum - 'coupang' | 'smartstore' | 'amazon'
- `productId`: string - Platform-specific product ID
- `productName`: string
- `reviewId`: string - Unique per platform (indexed)
- `author`: string
- `rating`: integer (1-5)
- `reviewText`: text
- `sentiment`: enum - 'positive' | 'neutral' | 'negative' | 'crisis'
- `keywords`: JSON - Extracted keywords (e.g., ["배송", "품질"])
- `isCrisis`: boolean - Flagged for urgent response
- `alertedAt`: timestamp - When alert was sent
- `resolvedAt`: timestamp - When issue was resolved
- `scrapedAt`: timestamp

#### TypeScript Interface

```typescript
export interface EcommerceReview {
  id: string;
  platform: 'coupang' | 'smartstore' | 'amazon';
  productId: string;
  productName: string;
  reviewId: string;
  author?: string;
  rating: number;
  reviewText: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'crisis';
  keywords?: string[];
  isCrisis: boolean;
  alertedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  scrapedAt: Date;
}
```

#### Relationships
- Standalone (no direct FK relationships)

---

### EcommerceInquiry

**Purpose:** Captures customer Q&A from e-commerce platforms for AI-assisted responses.

**Key Attributes:**
- `id`: UUID
- `platform`: enum - 'coupang' | 'smartstore' | 'amazon'
- `productId`: string
- `inquiryId`: string - Unique per platform
- `customerName`: string
- `question`: text
- `category`: enum - 'delivery' | 'size' | 'usage' | 'refund' | 'other'
- `aiAnswer`: text - Generated response draft
- `aiConfidence`: float (0.0-1.0) - Confidence score
- `humanReviewed`: boolean
- `answeredAt`: timestamp
- `createdAt`: timestamp

#### TypeScript Interface

```typescript
export interface EcommerceInquiry {
  id: string;
  platform: 'coupang' | 'smartstore' | 'amazon';
  productId: string;
  inquiryId: string;
  customerName?: string;
  question: string;
  category?: 'delivery' | 'size' | 'usage' | 'refund' | 'other';
  aiAnswer?: string;
  aiConfidence?: number;
  humanReviewed: boolean;
  answeredAt?: Date;
  createdAt: Date;
}
```

#### Relationships
- Standalone

---

### CompetitorProduct

**Purpose:** Tracks competitor pricing and stock status for competitive analysis and opportunity detection.

**Key Attributes:**
- `id`: UUID
- `platform`: enum - 'coupang' | 'smartstore' | 'amazon'
- `competitorName`: string
- `productId`: string
- `productName`: string
- `price`: decimal
- `stockStatus`: enum - 'in-stock' | 'out-of-stock' | 'limited'
- `rating`: float
- `reviewCount`: integer
- `lastPriceChange`: timestamp
- `lastStockChange`: timestamp
- `scrapedAt`: timestamp

#### TypeScript Interface

```typescript
export interface CompetitorProduct {
  id: string;
  platform: 'coupang' | 'smartstore' | 'amazon';
  competitorName?: string;
  productId: string;
  productName?: string;
  price?: number;
  stockStatus: 'in-stock' | 'out-of-stock' | 'limited';
  rating?: number;
  reviewCount?: number;
  lastPriceChange?: Date;
  lastStockChange?: Date;
  scrapedAt: Date;
  createdAt: Date;
}
```

#### Relationships
- Standalone

---

## API Specification

### tRPC Router Definitions

```typescript
// src/server/api/root.ts
import { createTRPCRouter } from './trpc';
import { leadRouter } from './routers/lead';
import { chatbotRouter } from './routers/chatbot';
import { reviewRouter } from './routers/review';
import { inquiryRouter } from './routers/inquiry';

export const appRouter = createTRPCRouter({
  lead: leadRouter,
  chatbot: chatbotRouter,
  review: reviewRouter,
  inquiry: inquiryRouter,
});

export type AppRouter = typeof appRouter;
```

```typescript
// src/server/api/routers/lead.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const leadRouter = createTRPCRouter({
  // Create new lead from chatbot or form
  create: publicProcedure
    .input(z.object({
      companyName: z.string().min(1),
      contactName: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      country: z.string().optional(),
      industry: z.string().optional(),
      inquiryType: z.enum(['3M', 'PowerTools', 'Other']),
      message: z.string().optional(),
      source: z.enum(['chatbot', 'quote-form', 'contact-form']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Insert into database via Drizzle ORM
      const lead = await ctx.db.insert(leads).values({
        ...input,
        status: 'new',
      }).returning();

      // Send Slack notification
      await ctx.slack.sendLeadNotification(lead);

      return lead;
    }),

  // Get all leads with filtering
  list: publicProcedure
    .input(z.object({
      status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { status, limit, offset } = input;

      return await ctx.db.query.leads.findMany({
        where: status ? eq(leads.status, status) : undefined,
        limit,
        offset,
        orderBy: desc(leads.createdAt),
      });
    }),

  // Update lead status
  updateStatus: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
      status: z.enum(['new', 'contacted', 'qualified', 'closed']),
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.update(leads)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(leads.id, input.id))
        .returning();
    }),
});
```

```typescript
// src/server/api/routers/chatbot.ts
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { openai } from '@/lib/openai';

export const chatbotRouter = createTRPCRouter({
  // Send message to chatbot
  chat: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      message: z.string().min(1).max(1000),
      leadId: z.string().uuid().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check cache for similar questions
      const cachedResponse = await ctx.redis.get(`chat:${input.message}`);
      if (cachedResponse) {
        return JSON.parse(cachedResponse);
      }

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful B2B sales assistant for Daedong, specializing in 3M industrial products and power tools.' },
          { role: 'user', content: input.message },
        ],
        max_tokens: 300,
      });

      const botResponse = completion.choices[0].message.content;

      // Analyze sentiment and intent
      const { sentiment, intent } = await analyzeSentiment(input.message);

      // Save conversation
      const conversation = await ctx.db.insert(chatbotConversations).values({
        sessionId: input.sessionId,
        leadId: input.leadId,
        userMessage: input.message,
        botResponse,
        sentiment,
        intent,
      }).returning();

      // Cache for 24 hours
      await ctx.redis.setex(`chat:${input.message}`, 86400, JSON.stringify({ botResponse, sentiment, intent }));

      return { botResponse, sentiment, intent };
    }),
});
```

```typescript
// src/server/api/routers/review.ts
export const reviewRouter = createTRPCRouter({
  // Get crisis reviews
  getCrisis: publicProcedure
    .input(z.object({
      resolved: z.boolean().optional(),
    }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.ecommerceReviews.findMany({
        where: and(
          eq(ecommerceReviews.isCrisis, true),
          input.resolved ? isNotNull(ecommerceReviews.resolvedAt) : isNull(ecommerceReviews.resolvedAt)
        ),
        orderBy: desc(ecommerceReviews.createdAt),
      });
    }),

  // Mark crisis as resolved
  resolve: publicProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.update(ecommerceReviews)
        .set({ resolvedAt: new Date() })
        .where(eq(ecommerceReviews.id, input.id))
        .returning();
    }),
});
```

**Authentication:** Public procedures for MVP. Phase 2 will add `protectedProcedure` with NextAuth.js session validation.

---

## Components

### Web Application (Next.js)

**Responsibility:** Serves the B2B web portal (Track A), providing AI chatbot, personalization, and quote generation.

**Key Interfaces:**
- `GET /` - Home page with personalized content
- `GET /products` - Product catalog with AI search
- `GET /global-business` - B2B partnership information
- `POST /api/trpc/*` - tRPC API endpoints

**Dependencies:**
- OpenAI API (chatbot)
- PostgreSQL (lead storage)
- Redis (session cache)
- Pinecone (product search)

**Technology Stack:**
- Next.js 15 App Router
- React 19 Server/Client Components
- shadcn/ui + Tailwind CSS
- tRPC client

---

### Monitoring Bot (AWS Lambda)

**Responsibility:** Executes scheduled scraping of e-commerce platforms (Track B), analyzes reviews/inquiries with AI, and triggers alerts.

**Key Interfaces:**
- EventBridge schedule trigger (every 10 minutes)
- Slack Webhook API (alerts)
- PostgreSQL insert (scraped data)
- OpenAI API (sentiment analysis)

**Dependencies:**
- Playwright (scraping)
- PostgreSQL (data storage)
- Slack (notifications)
- OpenAI API (analysis)

**Technology Stack:**
- Node.js 20 Lambda runtime
- Playwright (headless browser)
- BullMQ (job queue - optional for retry logic)
- AWS EventBridge (scheduling)

---

### API Layer (tRPC)

**Responsibility:** Provides type-safe API for frontend, handles business logic, orchestrates AI calls.

**Key Interfaces:**
- `lead.create` - Create new B2B lead
- `chatbot.chat` - Send message to AI chatbot
- `review.getCrisis` - Fetch unresolved crisis reviews
- `inquiry.generateAnswer` - AI-generate CS response

**Dependencies:**
- Drizzle ORM (database access)
- OpenAI/Claude APIs
- Redis (caching)
- Slack (notifications)

**Technology Stack:**
- tRPC v10
- Zod (validation)
- Next.js API Routes

---

### Shared Package (TypeScript Types)

**Responsibility:** Provides shared TypeScript interfaces, constants, and utilities across frontend/backend.

**Key Interfaces:**
- Exports all data model interfaces
- Exports validation schemas (Zod)
- Exports constants (e.g., `PLATFORMS`, `LEAD_STATUSES`)

**Dependencies:** None (pure TypeScript)

**Technology Stack:**
- TypeScript 5.6
- Zod schemas

---

### Component Diagrams

```mermaid
C4Component
    title Component Diagram - Daedong AI Portal

    Container_Boundary(vercel, "Vercel") {
        Component(nextjs, "Next.js App", "React 19", "Web UI + API Routes")
        Component(trpc, "tRPC Router", "TypeScript", "Type-safe API layer")
        ComponentDb(redis, "Redis Cache", "ElastiCache", "Session + AI cache")
    }

    Container_Boundary(aws, "AWS") {
        Component(lambda, "Monitoring Bot", "Node.js 20", "Scraping + Analysis")
        ComponentDb(postgres, "PostgreSQL", "RDS", "Persistent storage")
        Component(eventbridge, "EventBridge", "Scheduler", "10min triggers")
    }

    System_Ext(openai, "OpenAI API", "GPT-4 Turbo")
    System_Ext(slack, "Slack", "Webhooks")
    System_Ext(ecommerce, "E-commerce Sites", "Coupang, SmartStore")

    Rel(nextjs, trpc, "Uses")
    Rel(trpc, postgres, "Reads/Writes")
    Rel(trpc, redis, "Caches")
    Rel(trpc, openai, "AI requests")
    Rel(trpc, slack, "Alerts")

    Rel(eventbridge, lambda, "Triggers")
    Rel(lambda, ecommerce, "Scrapes")
    Rel(lambda, postgres, "Writes")
    Rel(lambda, openai, "Analyzes")
    Rel(lambda, slack, "Crisis alerts")
```

---

## External APIs

### OpenAI API

- **Purpose:** Primary AI provider for chatbot, sentiment analysis, and CS response generation
- **Documentation:** https://platform.openai.com/docs/api-reference
- **Base URL(s):** https://api.openai.com/v1
- **Authentication:** Bearer token (API key in env var)
- **Rate Limits:** 10,000 RPM (requests per minute) on Tier 2, $1,000/month budget cap

**Key Endpoints Used:**
- `POST /chat/completions` - Chatbot conversations, sentiment analysis
- `POST /embeddings` - Generate embeddings for Pinecone (Phase 2)

**Integration Notes:**
- Implement exponential backoff for rate limits
- Cache identical requests in Redis (24h TTL)
- Monitor costs via OpenAI dashboard
- Fallback to Claude 3 Haiku if OpenAI is down

---

### Anthropic Claude API

- **Purpose:** Fallback AI provider for high availability
- **Documentation:** https://docs.anthropic.com/claude/reference
- **Base URL(s):** https://api.anthropic.com/v1
- **Authentication:** x-api-key header
- **Rate Limits:** 50 RPM on free tier, 5,000 RPM on paid

**Key Endpoints Used:**
- `POST /messages` - Chat completions (compatible with OpenAI structure)

**Integration Notes:** Only invoked when OpenAI returns 5xx errors

---

### Pinecone API

- **Purpose:** Vector database for semantic product search and RAG (Phase 2)
- **Documentation:** https://docs.pinecone.io/
- **Base URL(s):** https://api.pinecone.io
- **Authentication:** API key
- **Rate Limits:** 100 queries/second on free tier

**Key Endpoints Used:**
- `POST /vectors/upsert` - Insert product embeddings
- `POST /query` - Semantic search

**Integration Notes:** Free tier supports up to 100k vectors (sufficient for MVP)

---

### Slack Webhooks

- **Purpose:** Real-time notifications for leads and crisis alerts
- **Documentation:** https://api.slack.com/messaging/webhooks
- **Base URL(s):** https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
- **Authentication:** Webhook URL (secret)
- **Rate Limits:** 1 message per second per webhook

**Key Endpoints Used:**
- `POST /services/T.../B.../XXX` - Send formatted message

**Integration Notes:**
- Different webhooks for #sales (leads) and #cs (crisis)
- Include direct links to admin dashboard

---

## Core Workflows

### Workflow 1: B2B Lead Capture via Chatbot

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Next.js App
    participant tRPC
    participant Redis
    participant OpenAI
    participant DB as PostgreSQL
    participant Slack

    User->>NextJS: Visit product page (30s+)
    NextJS->>User: Display chatbot prompt
    User->>NextJS: Send message "3M 견적 요청"
    NextJS->>tRPC: chatbot.chat({ message })

    tRPC->>Redis: Check cache
    alt Cache hit
        Redis-->>tRPC: Cached response
    else Cache miss
        tRPC->>OpenAI: POST /chat/completions
        OpenAI-->>tRPC: AI response
        tRPC->>Redis: Cache response (24h)
    end

    tRPC->>DB: INSERT chatbot_conversations
    tRPC-->>NextJS: { botResponse, intent: 'quotation' }
    NextJS->>User: "회사명과 이메일을 알려주시면..."

    User->>NextJS: "ABC Company, abc@example.com"
    NextJS->>tRPC: lead.create({ companyName, email })
    tRPC->>DB: INSERT leads (status='new')
    tRPC->>Slack: Send #sales notification
    tRPC-->>NextJS: { leadId }
    NextJS->>User: "24시간 내 연락드리겠습니다"
```

### Workflow 2: Crisis Review Detection & Response

```mermaid
sequenceDiagram
    participant EventBridge
    participant Lambda as Monitoring Bot
    participant Coupang
    participant OpenAI
    participant DB as PostgreSQL
    participant Slack
    participant CS as CS Team

    EventBridge->>Lambda: Trigger (every 10min)
    Lambda->>Coupang: Scrape reviews (Playwright)
    Coupang-->>Lambda: HTML content
    Lambda->>Lambda: Parse new reviews

    alt New review found
        Lambda->>OpenAI: Analyze sentiment
        OpenAI-->>Lambda: { sentiment: "crisis", keywords: ["불량", "환불"] }
        Lambda->>DB: INSERT ecommerce_reviews (isCrisis=true)
        Lambda->>Slack: 🚨 POST #cs webhook
        Slack-->>CS: Crisis alert
        CS->>User: Send 1:1 message (not public)
        CS->>NextJS Admin: Mark resolved
        NextJS->>tRPC: review.resolve({ id })
        tRPC->>DB: UPDATE resolvedAt
    end
```

### Workflow 3: Competitor Stockout Opportunity

```mermaid
sequenceDiagram
    participant EventBridge
    participant Lambda
    participant CompetitorSite
    participant DB
    participant Slack
    participant Marketing

    EventBridge->>Lambda: Trigger (hourly)
    Lambda->>CompetitorSite: Scrape product page
    CompetitorSite-->>Lambda: Stock status: "품절"
    Lambda->>DB: SELECT previous status
    DB-->>Lambda: Previous: "in-stock"

    alt Stock change detected
        Lambda->>DB: UPDATE lastStockChange
        Lambda->>Slack: 📈 POST #marketing "Competitor X 품절!"
        Slack-->>Marketing: Opportunity alert
        Marketing->>Marketing: Increase ad spend (manual)
    end
```

---

## Database Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(50),
  industry VARCHAR(100),
  inquiry_type VARCHAR(50) CHECK (inquiry_type IN ('3M', 'PowerTools', 'Other')),
  message TEXT,
  source VARCHAR(100) CHECK (source IN ('chatbot', 'quote-form', 'contact-form')),
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chatbot conversations table
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(255) NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  sentiment VARCHAR(50) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  intent VARCHAR(100) CHECK (intent IN ('inquiry', 'quotation', 'product-info', 'other')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- E-commerce reviews table
CREATE TABLE ecommerce_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('coupang', 'smartstore', 'amazon')),
  product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255),
  review_id VARCHAR(255) UNIQUE NOT NULL,
  author VARCHAR(255),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  sentiment VARCHAR(50) CHECK (sentiment IN ('positive', 'neutral', 'negative', 'crisis')),
  keywords JSONB,
  is_crisis BOOLEAN DEFAULT FALSE,
  alerted_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  scraped_at TIMESTAMP DEFAULT NOW()
);

-- E-commerce inquiries table
CREATE TABLE ecommerce_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('coupang', 'smartstore', 'amazon')),
  product_id VARCHAR(255) NOT NULL,
  inquiry_id VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  question TEXT NOT NULL,
  category VARCHAR(100) CHECK (category IN ('delivery', 'size', 'usage', 'refund', 'other')),
  ai_answer TEXT,
  ai_confidence FLOAT CHECK (ai_confidence >= 0.0 AND ai_confidence <= 1.0),
  human_reviewed BOOLEAN DEFAULT FALSE,
  answered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Competitor products table
CREATE TABLE competitor_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('coupang', 'smartstore', 'amazon')),
  competitor_name VARCHAR(255),
  product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255),
  price DECIMAL(10, 2),
  stock_status VARCHAR(50) CHECK (stock_status IN ('in-stock', 'out-of-stock', 'limited')),
  rating FLOAT,
  review_count INT,
  last_price_change TIMESTAMP,
  last_stock_change TIMESTAMP,
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

CREATE INDEX idx_chatbot_session ON chatbot_conversations(session_id);
CREATE INDEX idx_chatbot_lead ON chatbot_conversations(lead_id);

CREATE INDEX idx_reviews_platform_product ON ecommerce_reviews(platform, product_id);
CREATE INDEX idx_reviews_sentiment ON ecommerce_reviews(sentiment);
CREATE INDEX idx_reviews_is_crisis ON ecommerce_reviews(is_crisis) WHERE is_crisis = TRUE;
CREATE INDEX idx_reviews_scraped ON ecommerce_reviews(scraped_at DESC);

CREATE INDEX idx_inquiries_platform ON ecommerce_inquiries(platform);
CREATE INDEX idx_inquiries_unanswered ON ecommerce_inquiries(answered_at) WHERE answered_at IS NULL;

CREATE INDEX idx_competitors_platform_product ON competitor_products(platform, product_id);
CREATE INDEX idx_competitors_stock ON competitor_products(stock_status);
CREATE INDEX idx_competitors_scraped ON competitor_products(scraped_at DESC);
```

**Migration Strategy:**
- Use Drizzle Kit for schema migrations
- Development: `pnpm db:push` (direct schema sync to SQLite)
- Production: `pnpm db:migrate` (versioned SQL migrations)

---

## Frontend Architecture

### Component Architecture

#### Component Organization

```
src/
├── app/                          # Next.js 15 App Router
│   ├── (marketing)/              # Route group (no auth)
│   │   ├── page.tsx              # Home page
│   │   ├── products/page.tsx     # Product catalog
│   │   └── global-business/page.tsx
│   ├── (dashboard)/              # Route group (auth required - Phase 2)
│   │   └── admin/
│   │       ├── leads/page.tsx
│   │       └── reviews/page.tsx
│   ├── api/                      # API Routes
│   │   └── trpc/[trpc]/route.ts  # tRPC handler
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── chatbot/
│   │   ├── chatbot-widget.tsx    # Floating chat button
│   │   ├── chatbot-dialog.tsx    # Chat interface
│   │   └── message-list.tsx
│   ├── forms/
│   │   ├── quote-form.tsx        # B2B quote request
│   │   └── contact-form.tsx
│   └── layout/
│       ├── header.tsx
│       ├── footer.tsx
│       └── nav.tsx
├── lib/
│   ├── trpc/                     # tRPC client setup
│   │   ├── client.ts
│   │   └── server.ts
│   ├── utils.ts                  # cn() helper, etc.
│   └── constants.ts
└── stores/
    └── chatbot-store.ts          # Zustand store
```

#### Component Template

```typescript
// src/components/chatbot/chatbot-widget.tsx
'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatbotDialog } from './chatbot-dialog';
import { useChatbotStore } from '@/stores/chatbot-store';

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { sessionId } = useChatbotStore();

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <ChatbotDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        sessionId={sessionId}
      />
    </>
  );
}
```

### State Management Architecture

#### State Structure

```typescript
// src/stores/chatbot-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotState {
  sessionId: string;
  messages: Message[];
  isLoading: boolean;

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      sessionId: crypto.randomUUID(),
      messages: [],
      isLoading: false,

      addMessage: (message) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: crypto.randomUUID(),
            timestamp: new Date(),
          },
        ],
      })),

      setLoading: (loading) => set({ isLoading: loading }),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chatbot-storage',
      partialize: (state) => ({ sessionId: state.sessionId, messages: state.messages }),
    }
  )
);
```

#### State Management Patterns

- **Local UI State:** useState for component-local state (modals, dropdowns)
- **Shared Client State:** Zustand for cross-component state (chatbot, theme)
- **Server State:** tRPC hooks (useQuery, useMutation) for API data
- **Form State:** React Hook Form with Zod validation
- **Persistence:** Zustand persist middleware for sessionId and chat history

### Routing Architecture

#### Route Organization

```
app/
├── (marketing)/           # Public routes
│   ├── layout.tsx         # Marketing layout (header/footer)
│   ├── page.tsx           # / - Home
│   ├── about/page.tsx     # /about
│   ├── products/
│   │   ├── page.tsx       # /products
│   │   └── [id]/page.tsx  # /products/:id
│   ├── global-business/page.tsx  # /global-business
│   └── contact/page.tsx   # /contact
├── (dashboard)/           # Authenticated routes (Phase 2)
│   ├── layout.tsx         # Dashboard layout (sidebar)
│   └── admin/
│       ├── leads/page.tsx
│       ├── reviews/page.tsx
│       └── analytics/page.tsx
└── api/
    └── trpc/[trpc]/route.ts
```

#### Protected Route Pattern (Phase 2)

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Frontend Services Layer

#### API Client Setup

```typescript
// src/lib/trpc/client.ts
'use client';

import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@/server/api/root';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

#### Service Example

```typescript
// src/components/chatbot/chatbot-dialog.tsx
'use client';

import { trpc } from '@/lib/trpc/client';
import { useChatbotStore } from '@/stores/chatbot-store';

export function ChatbotDialog({ sessionId }: { sessionId: string }) {
  const { messages, addMessage, setLoading } = useChatbotStore();

  const chatMutation = trpc.chatbot.chat.useMutation({
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      addMessage({ role: 'assistant', content: data.botResponse });
      setLoading(false);
    },
    onError: () => setLoading(false),
  });

  const handleSend = (message: string) => {
    addMessage({ role: 'user', content: message });
    chatMutation.mutate({ sessionId, message });
  };

  // ... render logic
}
```

---

## Backend Architecture

### Service Architecture

#### Serverless Architecture

##### Function Organization

```
apps/
├── web/                    # Next.js app with API Routes
│   └── src/
│       └── app/api/
│           └── trpc/[trpc]/route.ts
└── monitoring-bot/         # AWS Lambda functions
    ├── src/
    │   ├── handlers/
    │   │   ├── scrape-reviews.ts       # Main handler
    │   │   ├── scrape-competitors.ts
    │   │   └── analyze-daily.ts
    │   ├── lib/
    │   │   ├── playwright.ts           # Browser setup
    │   │   ├── openai.ts               # AI client
    │   │   └── slack.ts                # Notification
    │   └── utils/
    │       └── scraper-utils.ts
    ├── template.yaml                   # AWS SAM template
    └── package.json
```

##### Function Template

```typescript
// apps/monitoring-bot/src/handlers/scrape-reviews.ts
import { EventBridgeEvent } from 'aws-lambda';
import { chromium } from 'playwright-aws-lambda';
import { db } from '@daedong/db';
import { ecommerceReviews } from '@daedong/db/schema';
import { analyzeReview } from '../lib/openai';
import { sendCrisisAlert } from '../lib/slack';

export const handler = async (event: EventBridgeEvent<'Scheduled Event', {}>) => {
  console.log('Starting review scraping...', { time: event.time });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Scrape Coupang reviews
    await page.goto('https://www.coupang.com/vp/products/12345');

    const reviews = await page.$$eval('.sdp-review__article', (elements) =>
      elements.map((el) => ({
        reviewId: el.getAttribute('data-review-id'),
        author: el.querySelector('.sdp-review__author')?.textContent,
        rating: parseInt(el.querySelector('.sdp-review__rating')?.getAttribute('data-rating') || '0'),
        reviewText: el.querySelector('.sdp-review__text')?.textContent,
      }))
    );

    for (const review of reviews) {
      // Check if already processed
      const existing = await db.query.ecommerceReviews.findFirst({
        where: eq(ecommerceReviews.reviewId, review.reviewId),
      });

      if (existing) continue;

      // Analyze sentiment with AI
      const { sentiment, keywords, isCrisis } = await analyzeReview(review.reviewText);

      // Save to database
      await db.insert(ecommerceReviews).values({
        platform: 'coupang',
        productId: '12345',
        reviewId: review.reviewId,
        author: review.author,
        rating: review.rating,
        reviewText: review.reviewText,
        sentiment,
        keywords,
        isCrisis,
        alertedAt: isCrisis ? new Date() : undefined,
      });

      // Send crisis alert
      if (isCrisis) {
        await sendCrisisAlert({
          platform: 'coupang',
          reviewText: review.reviewText,
          rating: review.rating,
        });
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ processed: reviews.length }),
    };
  } finally {
    await browser.close();
  }
};
```

### Database Architecture

#### Schema Design

See **Database Schema** section above for complete SQL schema.

#### Data Access Layer

```typescript
// packages/db/src/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from './schema';

const isProd = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL!;

export const db = isProd
  ? drizzlePg(postgres(databaseUrl), { schema })
  : drizzle(new Database('sqlite.db'), { schema });

// Repository pattern example
export class LeadRepository {
  async create(data: typeof schema.leads.$inferInsert) {
    const [lead] = await db.insert(schema.leads).values(data).returning();
    return lead;
  }

  async findById(id: string) {
    return db.query.leads.findFirst({
      where: eq(schema.leads.id, id),
    });
  }

  async updateStatus(id: string, status: string) {
    const [updated] = await db
      .update(schema.leads)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.leads.id, id))
      .returning();
    return updated;
  }
}
```

### Authentication and Authorization (Phase 2)

#### Auth Flow

```mermaid
sequenceDiagram
    participant User
    participant NextJS
    participant NextAuth
    participant DB

    User->>NextJS: Click "Admin Login"
    NextJS->>NextAuth: Redirect to /api/auth/signin
    NextAuth->>User: Show OAuth provider (Google)
    User->>NextAuth: Authenticate with Google
    NextAuth->>DB: Check if user exists
    NextAuth->>NextAuth: Create JWT session
    NextAuth-->>NextJS: Set session cookie
    NextJS-->>User: Redirect to /admin/leads
```

#### Middleware/Guards

```typescript
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await getServerSession();

  if (!session || !session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      session,
      userId: session.user.id,
    },
  });
});
```

---

## Unified Project Structure

```plaintext
daedong-portal/
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Lint, test, type-check
│       └── deploy.yml                  # Deploy to Vercel + AWS
├── apps/
│   ├── web/                            # Next.js 15 web app
│   │   ├── src/
│   │   │   ├── app/                    # App Router
│   │   │   │   ├── (marketing)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── products/page.tsx
│   │   │   │   │   └── global-business/page.tsx
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── layout.tsx
│   │   │   │   │   └── admin/
│   │   │   │   │       ├── leads/page.tsx
│   │   │   │   │       └── reviews/page.tsx
│   │   │   │   ├── api/
│   │   │   │   │   └── trpc/[trpc]/route.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/                 # shadcn/ui components
│   │   │   │   ├── chatbot/
│   │   │   │   ├── forms/
│   │   │   │   └── layout/
│   │   │   ├── lib/
│   │   │   │   ├── trpc/
│   │   │   │   │   ├── client.ts
│   │   │   │   │   └── server.ts
│   │   │   │   ├── utils.ts
│   │   │   │   └── constants.ts
│   │   │   ├── server/
│   │   │   │   └── api/
│   │   │   │       ├── root.ts
│   │   │   │       ├── trpc.ts
│   │   │   │       └── routers/
│   │   │   │           ├── lead.ts
│   │   │   │           ├── chatbot.ts
│   │   │   │           ├── review.ts
│   │   │   │           └── inquiry.ts
│   │   │   └── stores/
│   │   │       └── chatbot-store.ts
│   │   ├── public/
│   │   │   ├── images/
│   │   │   └── fonts/
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   ├── .env.local.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── monitoring-bot/                 # AWS Lambda functions
│       ├── src/
│       │   ├── handlers/
│       │   │   ├── scrape-reviews.ts
│       │   │   ├── scrape-competitors.ts
│       │   │   └── analyze-daily.ts
│       │   ├── lib/
│       │   │   ├── playwright.ts
│       │   │   ├── openai.ts
│       │   │   ├── slack.ts
│       │   │   └── db.ts
│       │   └── utils/
│       │       └── scraper-utils.ts
│       ├── tests/
│       ├── template.yaml               # AWS SAM template
│       ├── tsconfig.json
│       └── package.json
├── packages/
│   ├── db/                             # Drizzle ORM + schemas
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── drizzle.config.ts
│   │   ├── migrations/                 # SQL migration files
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── shared/                         # Shared types/utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── lead.ts
│   │   │   │   ├── review.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   └── platforms.ts
│   │   │   └── utils/
│   │   │       └── validation.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── ui/                             # Shared UI components
│   │   ├── src/
│   │   │   └── components/
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── config/                         # Shared configs
│       ├── eslint/
│       │   └── index.js
│       ├── typescript/
│       │   └── base.json
│       └── tailwind/
│           └── base.js
├── infrastructure/                     # IaC (optional)
│   └── aws/
│       └── cloudformation/
├── scripts/                            # Build/deploy scripts
│   ├── setup-db.sh
│   └── deploy-lambda.sh
├── docs/
│   ├── prd.md
│   ├── brief.md
│   └── architecture.md
├── .env.example
├── .gitignore
├── package.json                        # Root package.json
├── pnpm-workspace.yaml
├── turbo.json                          # Turborepo config
└── README.md
```

---

## Development Workflow

### Local Development Setup

#### Prerequisites

```bash
# Required tools
node --version          # v20.10.0+
pnpm --version          # v8.0.0+
```

#### Initial Setup

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

#### Development Commands

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

### Environment Configuration

#### Required Environment Variables

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

## Deployment Architecture

### Deployment Strategy

**Frontend Deployment:**
- **Platform:** Vercel
- **Build Command:** `pnpm turbo build --filter=web`
- **Output Directory:** `apps/web/.next`
- **CDN/Edge:** Automatic via Vercel Edge Network
- **Custom Domain:** daedong.com (configure DNS A/CNAME records)

**Backend Deployment:**
- **Platform:** AWS Lambda (via AWS SAM or Serverless Framework)
- **Build Command:** `pnpm turbo build --filter=monitoring-bot && cd apps/monitoring-bot && sam build`
- **Deployment Method:** `sam deploy --guided` (first time), then CI/CD

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-lambda:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/setup-sam@v2
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - run: cd apps/monitoring-bot && sam build
      - run: cd apps/monitoring-bot && sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
```

### Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3000/api | Local development |
| Staging | https://staging.daedong.com | https://staging-api.daedong.com | Pre-production testing |
| Production | https://daedong.com | https://api.daedong.com | Live environment |

---

## Security and Performance

### Security Requirements

**Frontend Security:**
- **CSP Headers:** `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://api.openai.com https://api.anthropic.com;`
- **XSS Prevention:** React auto-escaping, sanitize user input with DOMPurify before rendering HTML
- **Secure Storage:** Use httpOnly cookies for sessions (NextAuth), never store tokens in localStorage

**Backend Security:**
- **Input Validation:** Zod schemas on all tRPC inputs, reject invalid data early
- **Rate Limiting:** Vercel Edge Config for IP-based rate limiting (10 req/min per IP for chatbot)
- **CORS Policy:** `Access-Control-Allow-Origin: https://daedong.com` (production), `http://localhost:3000` (dev)

**Authentication Security (Phase 2):**
- **Token Storage:** httpOnly cookies for NextAuth session tokens
- **Session Management:** JWT with 30-day expiry, refresh on activity
- **Password Policy:** N/A (OAuth only - Google, no passwords)

**Data Security:**
- **At Rest:** AWS RDS encryption (AES-256), SQLite unencrypted (local only)
- **In Transit:** TLS 1.3 for all external connections
- **PII Protection:** Hash emails before logging, never log phone numbers

### Performance Optimization

**Frontend Performance:**
- **Bundle Size Target:** < 200 KB (gzipped) for main bundle
- **Loading Strategy:** Next.js automatic code splitting, lazy load components below fold
- **Caching Strategy:**
  - Static assets: `Cache-Control: public, max-age=31536000, immutable`
  - API responses: `Cache-Control: private, max-age=60` for non-personalized data

**Backend Performance:**
- **Response Time Target:** < 200ms (p95) for API endpoints, < 1s for chatbot (cache hit), < 3s (cache miss)
- **Database Optimization:**
  - Connection pooling (max 20 connections)
  - Indexes on all foreign keys and WHERE clause columns
  - EXPLAIN ANALYZE all queries > 100ms
- **Caching Strategy:**
  - Redis for AI responses (24h TTL)
  - Chatbot sessions (30min TTL)
  - Product data (1h TTL)

**Core Web Vitals Targets:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

---

## Testing Strategy

### Testing Pyramid

```
        E2E Tests (Playwright)
        /                     \
      Integration Tests (Vitest)
     /                           \
  Frontend Unit    Backend Unit
  (Vitest)         (Vitest)
```

### Test Organization

#### Frontend Tests

```
apps/web/tests/
├── unit/
│   ├── components/
│   │   ├── chatbot-widget.test.tsx
│   │   └── quote-form.test.tsx
│   └── lib/
│       └── utils.test.ts
├── integration/
│   └── trpc/
│       └── lead-flow.test.ts
└── e2e/
    ├── chatbot-lead-capture.spec.ts
    └── quote-form-submission.spec.ts
```

#### Backend Tests

```
apps/monitoring-bot/tests/
├── unit/
│   ├── lib/
│   │   ├── openai.test.ts
│   │   └── slack.test.ts
│   └── utils/
│       └── scraper-utils.test.ts
└── integration/
    └── handlers/
        └── scrape-reviews.test.ts
```

#### E2E Tests

```
apps/web/tests/e2e/
├── chatbot-lead-capture.spec.ts
├── quote-form-submission.spec.ts
└── admin-dashboard.spec.ts
```

### Test Examples

#### Frontend Component Test

```typescript
// apps/web/tests/unit/components/chatbot-widget.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget';

describe('ChatbotWidget', () => {
  it('should open dialog when button clicked', () => {
    render(<ChatbotWidget />);

    const button = screen.getByLabelText('Open chatbot');
    fireEvent.click(button);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
```

#### Backend API Test

```typescript
// apps/web/tests/integration/trpc/lead-flow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { appRouter } from '@/server/api/root';
import { createInnerTRPCContext } from '@/server/api/trpc';

describe('Lead Flow', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    const ctx = createInnerTRPCContext({ session: null });
    caller = appRouter.createCaller(ctx);
  });

  it('should create lead and send notification', async () => {
    const input = {
      companyName: 'Test Company',
      email: 'test@example.com',
      inquiryType: '3M' as const,
      source: 'chatbot' as const,
    };

    const lead = await caller.lead.create(input);

    expect(lead).toMatchObject({
      companyName: 'Test Company',
      email: 'test@example.com',
      status: 'new',
    });
  });
});
```

#### E2E Test

```typescript
// apps/web/tests/e2e/chatbot-lead-capture.spec.ts
import { test, expect } from '@playwright/test';

test('chatbot should capture B2B lead', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Wait for chatbot to appear after 30s (or skip for testing)
  await page.click('[aria-label="Open chatbot"]');

  // Send initial message
  await page.fill('[placeholder="Type your message..."]', '3M 제품 견적 요청');
  await page.click('button:has-text("Send")');

  // Wait for AI response
  await expect(page.locator('text=회사명과 이메일')).toBeVisible();

  // Provide company info
  await page.fill('[placeholder="Type your message..."]', 'ABC Company, abc@example.com');
  await page.click('button:has-text("Send")');

  // Verify confirmation
  await expect(page.locator('text=24시간 내 연락')).toBeVisible();
});
```

---

## Coding Standards

### Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `packages/shared/src/types` and import from `@daedong/shared`. Never duplicate type definitions between frontend and backend.
- **API Calls:** Never make direct HTTP calls with fetch - always use tRPC hooks (`trpc.lead.create.useMutation()`). This ensures type safety and error handling.
- **Environment Variables:** Access only through validated config objects (`import { env } from '@/env'`), never `process.env` directly. Use `@t3-oss/env-nextjs` for type-safe env vars.
- **Error Handling:** All tRPC procedures must use `TRPCError` with appropriate codes (`UNAUTHORIZED`, `NOT_FOUND`, etc.). Never throw generic Error objects.
- **State Updates:** Never mutate Zustand state directly - use store actions. For React state, never mutate state objects/arrays.
- **Database Queries:** Always use Drizzle ORM - never write raw SQL unless absolutely necessary (and document why).
- **Component Imports:** Use absolute imports (`@/components/ui/button`) instead of relative (`../../components/ui/button`).
- **Async/Await:** Always use async/await for promises, never `.then()` chains (except in edge middleware).

### Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `ChatbotWidget.tsx` |
| Hooks | camelCase with 'use' | - | `useChatbotStore.ts` |
| tRPC Procedures | camelCase | camelCase | `lead.create`, `chatbot.chat` |
| API Routes | - | kebab-case | `/api/trpc/lead.create` |
| Database Tables | - | snake_case | `ecommerce_reviews` |
| TypeScript Interfaces | PascalCase | PascalCase | `interface Lead {}` |
| Zustand Stores | camelCase + 'Store' | - | `chatbotStore.ts` |
| Environment Variables | UPPER_SNAKE | UPPER_SNAKE | `OPENAI_API_KEY` |

---

## Error Handling Strategy

### Error Flow

```mermaid
sequenceDiagram
    participant Client
    participant tRPC
    participant Backend
    participant External as External API

    Client->>tRPC: API call
    tRPC->>Backend: Invoke procedure
    Backend->>External: Call OpenAI

    alt Success
        External-->>Backend: 200 OK
        Backend-->>tRPC: Return data
        tRPC-->>Client: Success response
    else API Error
        External-->>Backend: 429 Rate Limit
        Backend->>Backend: Log error
        Backend-->>tRPC: TRPCError (INTERNAL_SERVER_ERROR)
        tRPC-->>Client: Error response
        Client->>Client: Show toast notification
    else Validation Error
        Backend->>Backend: Zod validation fails
        Backend-->>tRPC: TRPCError (BAD_REQUEST)
        tRPC-->>Client: Error response
        Client->>Client: Show field errors
    end
```

### Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;         // 'UNAUTHORIZED', 'NOT_FOUND', 'INTERNAL_SERVER_ERROR'
    message: string;      // Human-readable error message
    details?: Record<string, any>;  // Additional context
    timestamp: string;    // ISO 8601 timestamp
    requestId: string;    // For tracking in logs
  };
}
```

### Frontend Error Handling

```typescript
// src/lib/trpc/client.ts (tRPC client setup)
export const trpc = createTRPCReact<AppRouter>();

// Component usage
export function QuoteForm() {
  const createLead = trpc.lead.create.useMutation({
    onSuccess: () => {
      toast.success('Quote request submitted!');
    },
    onError: (error) => {
      if (error.data?.code === 'BAD_REQUEST') {
        toast.error(`Invalid input: ${error.message}`);
      } else {
        toast.error('Something went wrong. Please try again.');
        // Log to Sentry
        Sentry.captureException(error);
      }
    },
  });

  // ... form logic
}
```

### Backend Error Handling

```typescript
// src/server/api/routers/lead.ts
export const leadRouter = createTRPCRouter({
  create: publicProcedure
    .input(leadSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const lead = await ctx.db.insert(leads).values(input).returning();

        // Attempt to send Slack notification
        try {
          await ctx.slack.sendLeadNotification(lead);
        } catch (slackError) {
          // Log but don't fail the request
          console.error('Slack notification failed:', slackError);
          Sentry.captureException(slackError, {
            tags: { service: 'slack' },
            extra: { leadId: lead.id },
          });
        }

        return lead;
      } catch (error) {
        if (error instanceof DatabaseError) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create lead. Please try again.',
            cause: error,
          });
        }
        throw error;
      }
    }),
});
```

---

## Monitoring and Observability

### Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics (Web Vitals, page views, conversions)
- **Backend Monitoring:** AWS CloudWatch (Lambda metrics, logs)
- **Error Tracking:** Sentry (frontend + backend, real-time alerts)
- **Performance Monitoring:** Vercel Analytics + Sentry Performance

### Key Metrics

**Frontend Metrics:**
- **Core Web Vitals:** LCP, FID, CLS (Vercel Analytics)
- **JavaScript Errors:** Error rate, stack traces (Sentry)
- **API Response Times:** tRPC call durations (Sentry Performance)
- **User Interactions:** Button clicks, form submissions (custom events)

**Backend Metrics:**
- **Lambda Invocations:** Success rate, duration, concurrency (CloudWatch)
- **tRPC Error Rate:** Failed mutations/queries by endpoint (Sentry)
- **Database Query Performance:** Slow queries > 100ms (Drizzle logging)
- **AI API Costs:** OpenAI token usage, cost per request (custom dashboard)

**Business Metrics (Custom Dashboard - Phase 2):**
- **Lead Generation:** Leads per day, by source (chatbot vs form)
- **Crisis Response Time:** Time from alert to resolution
- **CS Automation Rate:** AI-answered inquiries / total inquiries
- **Competitor Opportunities:** Stockout detections per week

### Alerting Rules

- 🚨 **Critical (Pagerduty/Slack):**
  - Error rate > 5% for 5 minutes
  - API response time p95 > 3s
  - Lambda function failures > 10% (monitoring bot)
  - Database connection failures

- ⚠️ **Warning (Slack):**
  - Web Vitals degradation (LCP > 2.5s)
  - AI API costs > 80% of budget
  - Redis cache hit rate < 70%

---

## Checklist Results Report

_(This section will be populated after running the architect checklist via `*execute-checklist`)_

**Status:** Pending

To execute checklist:
```
*execute-checklist architect-checklist
```

---

**Document Complete**

This architecture document provides comprehensive guidance for AI-driven fullstack development of the Daedong AI-Powered Business Portal. All technical decisions are justified, implementation patterns are defined, and the dual-track architecture (B2B Portal + E-commerce Engine) is fully specified.

**Next Steps:**
1. Review architecture document with stakeholders
2. Execute architect checklist for validation
3. Begin implementation with `apps/web` (Next.js setup)
4. Set up CI/CD pipeline
5. Implement Phase 1 MVP features

---

_Generated by Winston (Architect Agent) on 2025-11-07_
