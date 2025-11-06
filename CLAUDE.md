# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Daedong (대동티엘 & 대동라이즈) AI-Powered Business Portal** project - a dual-track system combining:

- **Track A**: AI-driven B2B web portal for high-value partnerships and bulk quotations
- **Track B**: AI e-commerce engine for automated B2C/small B2B operations

**Status**: Early stage - PRD complete, implementation not yet started.

## Project Context (from PRD)

### Core Business Goals
1. 24/7 automated B2B lead generation and qualification
2. Intelligent e-commerce operations (CS automation, crisis management)
3. Global expansion via AI localization (Amazon, Shopify)
4. Data-driven decision making across all business activities

### Key Target Audiences
- **Persona A**: B2B international partners (distributors, buyers) - requiring trust signals, 3M official partnership validation, bulk quotations
- **Persona B**: B2C/small B2B buyers - requiring product search, authenticity verification, small-scale quotations

### Critical AI Features to Implement

#### Web Portal (Track A)
1. **24/7 AI Sales Agent Chatbot**: Visitor qualification, lead capture, intent detection
2. **Real-time Personalization Engine**: IP-based content adaptation, behavioral targeting
3. **Intelligent Quote Generator**: Conversational forms with AI-estimated pricing ranges
4. **Proactive Recommendation Engine**: Cross-selling based on browsing patterns

#### E-commerce Engine (Track B)
1. **E-commerce Monitoring System**: Automated web scraping of own/competitor stores (10-min intervals)
2. **AI-powered CS Automation**: 90% automation of simple inquiries, crisis detection
3. **Living Product Pages**: Auto-update based on review analysis and keyword extraction
4. **Competitor Analysis**: Real-time price/stock monitoring with opportunity alerts

## Planned Site Structure (IA)

```
HOME → Personalized Hero, Dual Funnel (Global vs E-Commerce)
├── ABOUT US → Core competencies, 3M partnership
├── GLOBAL BUSINESS → Export/import capabilities, partnership models, intelligent quotation
├── PRODUCTS → 3M solutions, power tools with AI search
├── E-COMMERCE → Channel links (Coupang, Smart Store, Amazon)
└── CONTACT → AI-classified inquiries (B2B/bulk/other)
```

## Technology Considerations

### When Starting Implementation

**Web Stack Selection**:
- Consider Next.js/React for modern web portal with SSR/SSG
- Requires multilingual support (Korean, English, Vietnamese as priority)
- Need real-time personalization capabilities

**AI Integration Points**:
- LLM API integration (OpenAI, Anthropic, or alternatives) for chatbot and content generation
- Visitor analytics integration for behavioral tracking
- ML model for lead scoring/qualification

**E-commerce Monitoring**:
- Web scraping infrastructure (consider headless browser solutions)
- Scheduled job system (10-min intervals for monitoring)
- Alert/notification system (Slack integration mentioned in PRD)

**Data Architecture**:
- Store visitor behavior data
- Lead/contact database
- Review/CS inquiry database with sentiment tags
- Competitor price/stock time-series data

### Key Product Partnerships
- **3M**: Official distribution partner - must validate and showcase this relationship
- **Power Tool Brands**: DeWALT and other global brands mentioned

### E-commerce Channels
- **Domestic**: Coupang (쿠팡), Naver Smart Store
- **Global**: Amazon FBA, Shopify D2C store

## Important Notes

### Security Considerations
- `.vscode-upload.json` contains SSH configuration templates - ensure credentials are never committed
- API keys for LLM services must be environment variables
- E-commerce scraping must respect robots.txt and rate limits

### Internationalization Priority
1. Korean (primary)
2. English (global B2B)
3. Vietnamese (PRD mentions Vietnam partnership use case)

### Business-Critical Flows
1. **B2B Lead Capture**: Visitor → AI chatbot qualification → contact info collection → quote generation
2. **Crisis CS Response**: Monitoring detects negative review → alert to staff → 1:1 private outreach (avoid public escalation)
3. **Competitor Opportunity**: Detect competitor stockout → alert → potential ad spend increase

### Out of Scope
- Daedong CMC / TL Biz business units (excluded per PRD)
- Custom payment/cart system development (use platform integrations)
- Custom AI model training (use existing LLM APIs)

## Development Workflow (To Be Established)

This section should be updated once the tech stack is chosen and the project is initialized with:
- Build commands
- Test commands
- Linting configuration
- Deployment process
- Environment setup instructions
