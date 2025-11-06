# Frontend Architecture

## Component Architecture

### Component Organization

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

### Component Template

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

## State Management Architecture

### State Structure

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

### State Management Patterns

- **Local UI State:** useState for component-local state (modals, dropdowns)
- **Shared Client State:** Zustand for cross-component state (chatbot, theme)
- **Server State:** tRPC hooks (useQuery, useMutation) for API data
- **Form State:** React Hook Form with Zod validation
- **Persistence:** Zustand persist middleware for sessionId and chat history

## Routing Architecture

### Route Organization

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

### Protected Route Pattern (Phase 2)

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

## Frontend Services Layer

### API Client Setup

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

### Service Example

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
