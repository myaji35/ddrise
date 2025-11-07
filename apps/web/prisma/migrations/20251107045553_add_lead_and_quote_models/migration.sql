-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "inquiryType" TEXT,
    "message" TEXT,
    "chatHistory" TEXT,
    "source" TEXT NOT NULL DEFAULT 'chatbot',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "aiSummary" TEXT,
    "aiScore" INTEGER,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "locale" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QuoteRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "leadId" TEXT,
    "productType" TEXT NOT NULL,
    "products" TEXT,
    "pipeMaterial" TEXT,
    "pipeDiameter" TEXT,
    "quantity" INTEGER,
    "requirements" TEXT,
    "estimatedPriceMin" REAL,
    "estimatedPriceMax" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "aiRecommendations" TEXT,
    "name" TEXT,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_sessionId_key" ON "Lead"("sessionId");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "QuoteRequest_status_idx" ON "QuoteRequest"("status");

-- CreateIndex
CREATE INDEX "QuoteRequest_createdAt_idx" ON "QuoteRequest"("createdAt");
