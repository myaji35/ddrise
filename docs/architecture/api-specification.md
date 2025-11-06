# API Specification

## tRPC Router Definitions

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
