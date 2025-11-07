import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Fallback response when OpenAI API is unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Product inquiries
  if (lowerMessage.includes('exact') || lowerMessage.includes('pipecut') || lowerMessage.includes('pipe')) {
    return `Thank you for your interest in EXACT pipe cutting equipment!

We offer a complete range:
• PipeCut 170E: 15-170mm, lightweight, battery model ($3,500-4,500)
• PipeCut 360 Pro: 100-360mm, bestseller ($12,000-16,000)
• PipeCut 460 Pro: 200-460mm, heavy-duty ($18,000-24,000)
• Infinity: Unlimited diameter ($35,000-50,000)

For an accurate quote, please visit our AI Quote page or provide:
- Pipe material (steel/stainless/plastic)
- Diameter range
- Quantity needed

How can I help you further?`;
  }

  if (lowerMessage.includes('3m') || lowerMessage.includes('tape') || lowerMessage.includes('adhesive')) {
    return `We are an official 3M distributor offering:

• VHB Structural Tape: Permanent bonding ($50-200/roll)
• Industrial Tapes: Double-sided, electrical insulation ($20-80/roll)
• Abrasives: Cubitron II, sanding discs ($30-300/box)
• Safety Equipment: Respirators, safety glasses ($10-60/unit)

Bulk discounts available for orders of 5+ units.

Would you like a quote for a specific product?`;
  }

  if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return `I'd be happy to help you with a quote!

For the most accurate pricing, please visit our AI Quote page where you can:
1. Select your product type
2. Enter quantity and specifications
3. Get instant price estimates (3 seconds!)

Alternatively, you can tell me:
- Product type (EXACT equipment or 3M products)
- Quantity needed
- Your country/region

What would you prefer?`;
  }

  if (lowerMessage.includes('partnership') || lowerMessage.includes('partner') || lowerMessage.includes('b2b')) {
    return `Excellent! We're always looking for reliable B2B partners worldwide.

Our partnership models:
• Official Distribution: Exclusive regional rights
• OEM/ODM: Products under your brand
• Project-Based: Large-scale plant/construction projects

To proceed, I'll need some information:
- Your company name
- Country/region
- Type of partnership you're interested in
- Email address for follow-up

Could you share these details?`;
  }

  // Default friendly response
  return `Hello! I'm the Daedong AI Assistant. I'm currently running in offline mode, but I can still help you with:

• Product information (EXACT pipe cutting, 3M industrial products)
• General pricing guidance
• Partnership inquiries
• Connecting you with our sales team

How can I assist you today?

Note: For full AI capabilities, please check back later or contact us directly at info@daedong-rise.com.`;
}

// Simple regex-based lead extraction (fallback)
function extractLeadInfoFallback(message: string, response: string): any {
  const combinedText = message + ' ' + response;
  const info: any = {};

  // Email
  const emailMatch = combinedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) info.email = emailMatch[1];

  // Phone (various formats)
  const phoneMatch = combinedText.match(/(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);
  if (phoneMatch) info.phone = phoneMatch[1];

  // Inquiry type detection
  const lowerText = combinedText.toLowerCase();
  if (lowerText.includes('partnership') || lowerText.includes('partner') || lowerText.includes('distributor')) {
    info.inquiryType = 'b2b';
  } else if (lowerText.includes('quote') || lowerText.includes('price') || lowerText.includes('bulk')) {
    info.inquiryType = 'quote';
  } else if (lowerText.includes('support') || lowerText.includes('help') || lowerText.includes('service')) {
    info.inquiryType = 'support';
  } else if (lowerText.includes('product') || lowerText.includes('spec') || lowerText.includes('information')) {
    info.inquiryType = 'product';
  }

  return Object.keys(info).length > 0 ? info : null;
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a professional AI sales assistant for Daedong TL & Daedong Rise, a B2B industrial solutions company.

**Company Overview:**
- Official distributor of 3M industrial products (tapes, adhesives, abrasives, safety equipment)
- Official partner of EXACT Tools (German premium pipe cutting systems)
- Specialized in B2B partnerships, bulk orders, and international trade

**Your Role:**
1. Answer questions about products (3M, EXACT)
2. Help customers request quotes for bulk orders
3. Qualify leads for B2B partnerships
4. Provide technical product information
5. Collect contact information naturally during conversation

**Product Information:**

3M Products:
- VHB Structural Tape: Permanent bonding, vibration absorption
- Industrial Tapes: Double-sided, electrical insulation
- Abrasives: Cubitron II, sanding discs
- Safety Equipment: Respirators, safety glasses

EXACT Tools:
- PipeCut 170E: 15-170mm, lightweight, battery model
- PipeCut 280 Pro: 50-280mm, stainless steel capable
- PipeCut 360 Pro: 100-360mm, bestseller, all-purpose
- PipeCut 460 Pro: 200-460mm, heavy-duty, large pipes
- Infinity: Unlimited diameter cutting

**Conversation Guidelines:**
- Be professional yet friendly
- Ask clarifying questions about their needs
- When appropriate, ask for: name, company, email, phone, country
- Identify inquiry type: B2B partnership, bulk quote, product inquiry, technical support
- For pipe cutting: Ask about material (steel/stainless/plastic), diameter, quantity
- Provide estimated price ranges when asked (e.g., "typically $X,XXX-$X,XXX range")

**Lead Qualification:**
- High priority: B2B partnerships, bulk orders >$10k, international distributors
- Medium priority: Project-based orders, regular B2B customers
- Low priority: General inquiries, single product questions

Respond in the user's language (Korean, English, or Arabic based on their message).`;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, history = [] } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Call OpenAI API
    let aiResponse: string;

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('API key not available');
      }

      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 500,
      });

      aiResponse = completion.choices[0]?.message?.content ||
        'I apologize, but I encountered an error. Please try again.';

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError.message);

      // Fallback response when OpenAI is unavailable
      aiResponse = getFallbackResponse(message);
    }

    // Extract lead information using AI
    const leadExtractionPrompt = `From this conversation, extract any contact information mentioned:
Message: "${message}"
Response: "${aiResponse}"

Return ONLY a JSON object with these fields (use null if not found):
{
  "name": string | null,
  "company": string | null,
  "email": string | null,
  "phone": string | null,
  "country": string | null,
  "inquiryType": "b2b" | "quote" | "product" | "support" | "other" | null
}`;

    let leadInfo = null;

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('API key not available');
      }

      const leadExtraction = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a data extraction assistant. Return only valid JSON.' },
          { role: 'user', content: leadExtractionPrompt },
        ],
        temperature: 0,
        max_tokens: 200,
      });

      const extractedText = leadExtraction.choices[0]?.message?.content || '{}';
      leadInfo = JSON.parse(extractedText);

      // Filter out null values
      leadInfo = Object.fromEntries(
        Object.entries(leadInfo).filter(([_, v]) => v !== null)
      );
    } catch (e) {
      console.error('Failed to extract lead info with AI:', e);

      // Fallback: Simple regex-based extraction
      leadInfo = extractLeadInfoFallback(message, aiResponse);
    }

    // Save or update lead in database if we have any information
    if (leadInfo && Object.keys(leadInfo).length > 0) {
      try {
        // Get IP and user agent
        const ipAddress = request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Update or create lead
        const existingLead = await prisma.lead.findUnique({
          where: { sessionId },
        });

        if (existingLead) {
          await prisma.lead.update({
            where: { sessionId },
            data: {
              ...leadInfo,
              chatHistory: JSON.stringify([...history, { role: 'user', content: message }, { role: 'assistant', content: aiResponse }]),
              updatedAt: new Date(),
            },
          });
        } else {
          await prisma.lead.create({
            data: {
              sessionId,
              ...leadInfo,
              chatHistory: JSON.stringify([{ role: 'user', content: message }, { role: 'assistant', content: aiResponse }]),
              ipAddress,
              userAgent,
              source: 'chatbot',
            },
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      response: aiResponse,
      leadInfo: leadInfo || undefined,
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
