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

// Fallback pricing estimation (rule-based)
function generateFallbackEstimate(
  productType: string,
  quantity: number,
  country: string,
  pipeDiameter?: string
) {
  let baseMin = 0;
  let baseMax = 0;
  let recommendations: string[] = [];

  // Base pricing by product type
  if (productType.includes('exact-pipecut')) {
    // Determine model based on diameter
    // Parse diameter (handle formats like "100-360" or "360")
    const diameterMatch = pipeDiameter?.match(/(\d+)/) || ['0', '0'];
    const diameter = parseInt(diameterMatch[1]);
    if (diameter <= 170) {
      baseMin = 3500;
      baseMax = 4500;
      recommendations.push('EXACT PipeCut 170E - Lightweight, ideal for field work');
    } else if (diameter <= 280) {
      baseMin = 8000;
      baseMax = 11000;
      recommendations.push('EXACT PipeCut 280 Pro - Powerful, stainless steel capable');
    } else if (diameter <= 360) {
      baseMin = 12000;
      baseMax = 16000;
      recommendations.push('EXACT PipeCut 360 Pro - Bestseller, all-purpose');
      recommendations.push('Consider INOX series for stainless steel (+$2,000)');
    } else if (diameter <= 460) {
      baseMin = 18000;
      baseMax = 24000;
      recommendations.push('EXACT PipeCut 460 Pro - Heavy-duty, large pipes');
    } else {
      baseMin = 35000;
      baseMax = 50000;
      recommendations.push('EXACT Infinity - Unlimited diameter cutting');
    }
  } else if (productType.includes('exact-consumables')) {
    baseMin = 80;
    baseMax = 400;
    recommendations.push('Cutting blades: $80-200 per blade');
    recommendations.push('Roller systems: $150-400 per set');
  } else if (productType.includes('3m')) {
    baseMin = 20;
    baseMax = 300;
    recommendations.push('Bulk orders available with volume discounts');
    recommendations.push('Contact for specific SKU pricing');
  }

  // Apply quantity discounts
  let discount = 0;
  if (quantity >= 50) discount = 0.25;
  else if (quantity >= 21) discount = 0.20;
  else if (quantity >= 11) discount = 0.15;
  else if (quantity >= 5) discount = 0.10;

  const totalMin = baseMin * quantity * (1 - discount);
  const totalMax = baseMax * quantity * (1 - discount);

  // Regional adjustments
  let regionalNote = '';
  if (country.toLowerCase().includes('uae') || country.toLowerCase().includes('saudi') || country.toLowerCase().includes('qatar')) {
    regionalNote = 'Middle East: +5-10% shipping/logistics fee may apply';
  }

  if (discount > 0) {
    recommendations.push(`Bulk discount applied: ${(discount * 100).toFixed(0)}%`);
  }

  if (regionalNote) {
    recommendations.push(regionalNote);
  }

  return {
    priceMin: Math.round(totalMin),
    priceMax: Math.round(totalMax),
    currency: 'USD',
    recommendations,
    confidence: 'Medium',
    notes: `Rule-based estimate. ${quantity} units with ${discount > 0 ? discount * 100 + '% bulk discount' : 'no discount'}.`,
  };
}

// Product pricing knowledge base
const PRICING_KNOWLEDGE = `
**3M Industrial Products (Approximate FOB Korea Prices):**
- VHB Structural Tape: $50-200 per roll (depending on size/grade)
- Double-sided Tape: $20-80 per roll
- Electrical Insulation Tape: $15-40 per roll
- Cubitron II Abrasives: $80-300 per box (25-50 pieces)
- Sanding Discs: $30-120 per box
- Respirator Masks (N95/P100): $15-60 per unit
- Safety Glasses: $10-40 per unit

**EXACT Pipe Cutting Equipment (Approximate Prices):**
- PipeCut 170E: $3,500-4,500
- PipeCut 220E: $4,500-6,000
- PipeCut 280 Pro: $8,000-11,000
- PipeCut 360 Pro: $12,000-16,000 (bestseller)
- PipeCut 460 Pro: $18,000-24,000
- Infinity Unlimited: $35,000-50,000
- Battery Models: +$1,500-3,000 premium
- INOX Stainless Series: +$2,000-4,000 premium

**EXACT Consumables:**
- Cutting Blades: $80-200 per blade (material dependent)
- Roller Systems: $150-400 per set
- Battery Packs: $400-800 per unit

**Bulk Order Discounts:**
- 5-10 units: 5-10% discount
- 11-20 units: 10-15% discount
- 21-50 units: 15-20% discount
- 50+ units: 20-25% discount (negotiable)

**B2B Partnership Terms:**
- Exclusive distributors: Additional 5-10% discount
- Project-based (>$50k): Custom pricing
- Payment terms: 30-60 days net for verified partners

**Regional Pricing Adjustments:**
- Middle East: +5-10% (shipping/logistics)
- Southeast Asia: Standard pricing
- Europe: -5% (EXACT partnership)
- Other regions: Quote on request
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productType,
      pipeMaterial,
      pipeDiameter,
      quantity,
      requirements,
      name,
      company,
      email,
      phone,
      country,
    } = body;

    if (!productType || !quantity || !name || !company || !email || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build AI prompt for price estimation
    const estimationPrompt = `You are a B2B pricing specialist for Daedong TL & Daedong Rise.

Given the following quote request:
- Product Type: ${productType}
- Pipe Material: ${pipeMaterial || 'N/A'}
- Pipe Diameter: ${pipeDiameter || 'N/A'}
- Quantity: ${quantity} units
- Country: ${country}
- Additional Requirements: ${requirements || 'None'}

Using this pricing knowledge:
${PRICING_KNOWLEDGE}

Provide a JSON response with:
1. Estimated price range (min and max in USD)
2. Product recommendations (2-3 specific models/products that best fit the requirements)
3. Confidence level (High/Medium/Low)
4. Bulk discount applied (if any)

Consider:
- Quantity-based bulk discounts
- Regional pricing adjustments for ${country}
- Product suitability based on pipe diameter and material
- Any special requirements mentioned

Return ONLY valid JSON in this exact format:
{
  "priceMin": number,
  "priceMax": number,
  "currency": "USD",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "confidence": "High|Medium|Low",
  "notes": "brief explanation of pricing factors"
}`;

    // Call OpenAI for price estimation
    let estimate;

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('API key not available');
      }

      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a B2B pricing specialist. Return only valid JSON.',
          },
          {
            role: 'user',
            content: estimationPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const aiResponse = completion.choices[0]?.message?.content || '{}';
      estimate = JSON.parse(aiResponse);

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError.message);

      // Fallback: Rule-based pricing estimation
      estimate = generateFallbackEstimate(productType, quantity, country, pipeDiameter);
    }

    // Calculate AI lead score based on order value and requirements
    const avgPrice = (estimate.priceMin + estimate.priceMax) / 2;
    let aiScore = 50; // Base score

    if (avgPrice > 50000) aiScore += 30; // High value order
    else if (avgPrice > 20000) aiScore += 20;
    else if (avgPrice > 10000) aiScore += 10;

    if (parseInt(quantity) > 20) aiScore += 10; // Bulk order
    if (requirements && requirements.length > 50) aiScore += 5; // Detailed requirements
    if (country.toLowerCase().includes('uae') ||
        country.toLowerCase().includes('saudi') ||
        country.toLowerCase().includes('qatar')) {
      aiScore += 10; // High-priority region
    }

    // Determine priority based on score
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    if (aiScore >= 80) priority = 'URGENT';
    else if (aiScore >= 65) priority = 'HIGH';
    else if (aiScore < 40) priority = 'LOW';

    // Save quote request to database
    try {
      const ipAddress = request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown';

      await prisma.quoteRequest.create({
        data: {
          productType,
          pipeMaterial: pipeMaterial || null,
          pipeDiameter: pipeDiameter || null,
          quantity: parseInt(quantity),
          requirements: requirements || null,
          estimatedPriceMin: estimate.priceMin,
          estimatedPriceMax: estimate.priceMax,
          currency: estimate.currency,
          aiRecommendations: JSON.stringify(estimate.recommendations),
          name,
          company,
          email,
          phone: phone || null,
          country,
          status: 'PENDING',
        },
      });

      // Also create/update lead
      const sessionId = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await prisma.lead.create({
        data: {
          sessionId,
          name,
          company,
          email,
          phone: phone || null,
          country,
          inquiryType: 'quote',
          message: `Quote request: ${productType}, Qty: ${quantity}, Est: $${estimate.priceMin}-${estimate.priceMax}`,
          source: 'quote_form',
          status: 'NEW',
          priority,
          aiScore,
          aiSummary: `Quote request for ${productType} (${quantity} units) from ${company} in ${country}. Estimated value: $${avgPrice.toFixed(0)}. ${estimate.notes || ''}`,
          ipAddress,
        },
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the request if DB save fails
    }

    return NextResponse.json({
      success: true,
      estimate: {
        priceMin: estimate.priceMin,
        priceMax: estimate.priceMax,
        currency: estimate.currency,
        recommendations: estimate.recommendations || [],
        confidence: estimate.confidence || 'Medium',
      },
    });

  } catch (error: any) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
