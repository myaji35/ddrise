# Database Schema

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
