# Data Models

## Lead (B2B Contact)

**Purpose:** Captures potential B2B partners and distributors identified through website interactions (chatbot, quote forms).

**Key Attributes:**
- `id`: UUID - Unique identifier
- `companyName`: string - Business name
- `contactName`: string - Contact person
- `email`: string - Email address (required)
- `phone`: string - Phone number (optional)
- `country`: string - Geographic location
- `industry`: string - Industry sector (e.g., "Construction", "Manufacturing")
- `inquiryType`: enum - '3M' | 'PowerTools' | 'Other'
- `message`: text - Initial inquiry message
- `source`: enum - 'chatbot' | 'quote-form' | 'contact-form'
- `status`: enum - 'new' | 'contacted' | 'qualified' | 'closed'
- `createdAt`: timestamp
- `updatedAt`: timestamp

### TypeScript Interface

```typescript
export interface Lead {
  id: string;
  companyName: string;
  contactName?: string;
  email: string;
  phone?: string;
  country?: string;
  industry?: string;
  inquiryType: 'chatbot' | 'quote-form' | 'contact-form';
  message?: string;
  source: 'chatbot' | 'quote-form' | 'contact-form';
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}
```

### Relationships
- One-to-many with `ChatbotConversation` (a lead can have multiple chat sessions)

---

## ChatbotConversation

**Purpose:** Logs all chatbot interactions for lead qualification analysis and AI training.

**Key Attributes:**
- `id`: UUID
- `sessionId`: string - Browser session identifier
- `leadId`: UUID - Foreign key to Lead (nullable until qualified)
- `userMessage`: text - User's message
- `botResponse`: text - AI-generated response
- `sentiment`: enum - 'positive' | 'neutral' | 'negative'
- `intent`: enum - 'inquiry' | 'quotation' | 'product-info' | 'other'
- `createdAt`: timestamp

### TypeScript Interface

```typescript
export interface ChatbotConversation {
  id: string;
  sessionId: string;
  leadId?: string;
  userMessage: string;
  botResponse: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  intent?: 'inquiry' | 'quotation' | 'product-info' | 'other';
  createdAt: Date;
}
```

### Relationships
- Many-to-one with `Lead`

---

## EcommerceReview

**Purpose:** Stores scraped customer reviews from e-commerce platforms for sentiment analysis and crisis detection.

**Key Attributes:**
- `id`: UUID
- `platform`: enum - 'coupang' | 'smartstore' | 'amazon'
- `productId`: string - Platform-specific product ID
- `productName`: string
- `reviewId`: string - Unique per platform (indexed)
- `author`: string
- `rating`: integer (1-5)
- `reviewText`: text
- `sentiment`: enum - 'positive' | 'neutral' | 'negative' | 'crisis'
- `keywords`: JSON - Extracted keywords (e.g., ["배송", "품질"])
- `isCrisis`: boolean - Flagged for urgent response
- `alertedAt`: timestamp - When alert was sent
- `resolvedAt`: timestamp - When issue was resolved
- `scrapedAt`: timestamp

### TypeScript Interface

```typescript
export interface EcommerceReview {
  id: string;
  platform: 'coupang' | 'smartstore' | 'amazon';
  productId: string;
  productName: string;
  reviewId: string;
  author?: string;
  rating: number;
  reviewText: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'crisis';
  keywords?: string[];
  isCrisis: boolean;
  alertedAt?: Date;
  resolvedAt?: Date;
  createdAt: Date;
  scrapedAt: Date;
}
```

### Relationships
- Standalone (no direct FK relationships)

---

## EcommerceInquiry

**Purpose:** Captures customer Q&A from e-commerce platforms for AI-assisted responses.

**Key Attributes:**
- `id`: UUID
- `platform`: enum - 'coupang' | 'smartstore' | 'amazon'
- `productId`: string
- `inquiryId`: string - Unique per platform
- `customerName`: string
- `question`: text
- `category`: enum - 'delivery' | 'size' | 'usage' | 'refund' | 'other'
- `aiAnswer`: text - Generated response draft
- `aiConfidence`: float (0.0-1.0) - Confidence score
- `humanReviewed`: boolean
- `answeredAt`: timestamp
- `createdAt`: timestamp

### TypeScript Interface

```typescript
export interface EcommerceInquiry {
  id: string;
  platform: 'coupang' | 'smartstore' | 'amazon';
  productId: string;
  inquiryId: string;
  customerName?: string;
  question: string;
  category?: 'delivery' | 'size' | 'usage' | 'refund' | 'other';
  aiAnswer?: string;
  aiConfidence?: number;
  humanReviewed: boolean;
  answeredAt?: Date;
  createdAt: Date;
}
```

### Relationships
- Standalone

---

## CompetitorProduct

**Purpose:** Tracks competitor pricing and stock status for competitive analysis and opportunity detection.

**Key Attributes:**
- `id`: UUID
- `platform`: enum - 'coupang' | 'smartstore' | 'amazon'
- `competitorName`: string
- `productId`: string
- `productName`: string
- `price`: decimal
- `stockStatus`: enum - 'in-stock' | 'out-of-stock' | 'limited'
- `rating`: float
- `reviewCount`: integer
- `lastPriceChange`: timestamp
- `lastStockChange`: timestamp
- `scrapedAt`: timestamp

### TypeScript Interface

```typescript
export interface CompetitorProduct {
  id: string;
  platform: 'coupang' | 'smartstore' | 'amazon';
  competitorName?: string;
  productId: string;
  productName?: string;
  price?: number;
  stockStatus: 'in-stock' | 'out-of-stock' | 'limited';
  rating?: number;
  reviewCount?: number;
  lastPriceChange?: Date;
  lastStockChange?: Date;
  scrapedAt: Date;
  createdAt: Date;
}
```

### Relationships
- Standalone

---
