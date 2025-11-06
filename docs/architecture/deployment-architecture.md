# Deployment Architecture

## Deployment Strategy

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

## CI/CD Pipeline

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

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|-------------|-------------|---------|
| Development | http://localhost:3000 | http://localhost:3000/api | Local development |
| Staging | https://staging.daedong.com | https://staging-api.daedong.com | Pre-production testing |
| Production | https://daedong.com | https://api.daedong.com | Live environment |

---
