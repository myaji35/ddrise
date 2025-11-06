# Security and Performance

## Security Requirements

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

## Performance Optimization

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
