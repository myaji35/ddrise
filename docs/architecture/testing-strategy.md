# Testing Strategy

## Testing Pyramid

```
        E2E Tests (Playwright)
        /                     \
      Integration Tests (Vitest)
     /                           \
  Frontend Unit    Backend Unit
  (Vitest)         (Vitest)
```

## Test Organization

### Frontend Tests

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

### Backend Tests

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

### E2E Tests

```
apps/web/tests/e2e/
├── chatbot-lead-capture.spec.ts
├── quote-form-submission.spec.ts
└── admin-dashboard.spec.ts
```

## Test Examples

### Frontend Component Test

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

### Backend API Test

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

### E2E Test

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
