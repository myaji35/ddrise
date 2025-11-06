# Monitoring and Observability

## Monitoring Stack

- **Frontend Monitoring:** Vercel Analytics (Web Vitals, page views, conversions)
- **Backend Monitoring:** AWS CloudWatch (Lambda metrics, logs)
- **Error Tracking:** Sentry (frontend + backend, real-time alerts)
- **Performance Monitoring:** Vercel Analytics + Sentry Performance

## Key Metrics

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

## Alerting Rules

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
