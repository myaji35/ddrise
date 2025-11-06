# External APIs

## OpenAI API

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

## Anthropic Claude API

- **Purpose:** Fallback AI provider for high availability
- **Documentation:** https://docs.anthropic.com/claude/reference
- **Base URL(s):** https://api.anthropic.com/v1
- **Authentication:** x-api-key header
- **Rate Limits:** 50 RPM on free tier, 5,000 RPM on paid

**Key Endpoints Used:**
- `POST /messages` - Chat completions (compatible with OpenAI structure)

**Integration Notes:** Only invoked when OpenAI returns 5xx errors

---

## Pinecone API

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

## Slack Webhooks

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
