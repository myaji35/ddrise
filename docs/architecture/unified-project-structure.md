# Unified Project Structure

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
