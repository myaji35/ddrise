# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define shared types in `packages/shared/src/types` and import from `@daedong/shared`. Never duplicate type definitions between frontend and backend.
- **API Calls:** Never make direct HTTP calls with fetch - always use tRPC hooks (`trpc.lead.create.useMutation()`). This ensures type safety and error handling.
- **Environment Variables:** Access only through validated config objects (`import { env } from '@/env'`), never `process.env` directly. Use `@t3-oss/env-nextjs` for type-safe env vars.
- **Error Handling:** All tRPC procedures must use `TRPCError` with appropriate codes (`UNAUTHORIZED`, `NOT_FOUND`, etc.). Never throw generic Error objects.
- **State Updates:** Never mutate Zustand state directly - use store actions. For React state, never mutate state objects/arrays.
- **Database Queries:** Always use Drizzle ORM - never write raw SQL unless absolutely necessary (and document why).
- **Component Imports:** Use absolute imports (`@/components/ui/button`) instead of relative (`../../components/ui/button`).
- **Async/Await:** Always use async/await for promises, never `.then()` chains (except in edge middleware).

## Naming Conventions

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
