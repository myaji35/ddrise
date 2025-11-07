/**
 * Personalization utilities for real-time content adaptation
 */

export interface VisitorContext {
  ipAddress: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  userAgent: string;
  referrer?: string;
  isReturning: boolean;
  visitCount: number;
}

export interface PersonalizationData {
  contentVariant: 'global-b2b' | 'e-commerce' | 'default';
  priorityProducts: string[];
  recommendedLanguage: string;
  targetRegion: string;
}

/**
 * Detect country from IP address (simplified version)
 * In production, use a service like MaxMind GeoIP or ip-api.com
 */
export function detectCountryFromIP(ip: string): string {
  // This is a placeholder. In production, use actual GeoIP service
  // For now, return a default
  return 'Unknown';
}

/**
 * Determine personalization strategy based on visitor context
 */
export function getPersonalizationStrategy(
  context: Partial<VisitorContext>
): PersonalizationData {
  const country = context.country?.toLowerCase() || '';
  const language = context.language?.toLowerCase() || 'en';

  // Middle East region detection
  const middleEastCountries = [
    'uae', 'saudi', 'qatar', 'kuwait', 'oman', 'bahrain',
    'united arab emirates', 'saudi arabia'
  ];
  const isMiddleEast = middleEastCountries.some(c => country.includes(c));

  // Asia-Pacific region detection
  const asiaPacificCountries = [
    'vietnam', 'thailand', 'indonesia', 'malaysia', 'singapore',
    'philippines', 'korea', 'japan', 'china'
  ];
  const isAsiaPacific = asiaPacificCountries.some(c => country.includes(c));

  let contentVariant: 'global-b2b' | 'e-commerce' | 'default' = 'default';
  let priorityProducts: string[] = [];
  let recommendedLanguage = language;
  let targetRegion = 'Global';

  // Middle East - B2B focus
  if (isMiddleEast) {
    contentVariant = 'global-b2b';
    priorityProducts = ['exact-pipecut', '3m-industrial', 'safety-equipment'];
    recommendedLanguage = country.includes('saudi') || country.includes('uae') ? 'ar' : 'en';
    targetRegion = 'Middle East';
  }
  // Asia-Pacific - Mixed
  else if (isAsiaPacific) {
    contentVariant = country.includes('vietnam') || country.includes('thailand')
      ? 'global-b2b'
      : 'e-commerce';
    priorityProducts = ['exact-pipecut', '3m-tape', 'power-tools'];
    targetRegion = 'Asia-Pacific';
  }
  // Korea - E-commerce focus
  else if (country.includes('korea') || language.includes('ko')) {
    contentVariant = 'e-commerce';
    priorityProducts = ['3m-consumer', 'power-tools', 'exact-consumer'];
    recommendedLanguage = 'ko';
    targetRegion = 'Korea';
  }
  // Europe/Americas - B2B focus
  else {
    contentVariant = 'global-b2b';
    priorityProducts = ['exact-pipecut', '3m-industrial'];
    targetRegion = 'Global';
  }

  return {
    contentVariant,
    priorityProducts,
    recommendedLanguage,
    targetRegion,
  };
}

/**
 * Track visitor behavior for personalization
 */
export interface BehaviorEvent {
  event: 'page_view' | 'product_view' | 'cta_click' | 'form_submit' | 'chatbot_open';
  page?: string;
  product?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Analyze behavior patterns to refine personalization
 */
export function analyzeBehaviorPattern(events: BehaviorEvent[]): {
  intent: 'b2b-partnership' | 'bulk-order' | 'product-research' | 'browsing';
  engagementLevel: 'high' | 'medium' | 'low';
  recommendedAction: string;
} {
  // Count event types
  const productViews = events.filter(e => e.event === 'product_view').length;
  const chatbotOpens = events.filter(e => e.event === 'chatbot_open').length;
  const formSubmits = events.filter(e => e.event === 'form_submit').length;
  const ctaClicks = events.filter(e => e.event === 'cta_click').length;

  // Determine intent
  let intent: 'b2b-partnership' | 'bulk-order' | 'product-research' | 'browsing' = 'browsing';
  let engagementLevel: 'high' | 'medium' | 'low' = 'low';
  let recommendedAction = 'Show welcome message';

  // High engagement indicators
  if (formSubmits > 0 || chatbotOpens > 0) {
    engagementLevel = 'high';
    if (formSubmits > 0) {
      intent = 'bulk-order';
      recommendedAction = 'Follow up on quote request';
    } else {
      intent = 'product-research';
      recommendedAction = 'Offer product consultation';
    }
  }
  // Medium engagement
  else if (productViews > 3 || ctaClicks > 2) {
    engagementLevel = 'medium';
    intent = 'product-research';
    recommendedAction = 'Show pricing information or chatbot prompt';
  }
  // Low engagement
  else if (productViews > 0) {
    engagementLevel = 'low';
    intent = 'browsing';
    recommendedAction = 'Show product recommendations';
  }

  return { intent, engagementLevel, recommendedAction };
}

/**
 * Get personalized hero message based on context
 */
export function getPersonalizedHeroMessage(
  personalization: PersonalizationData,
  locale: string
): { title: string; subtitle: string } {
  const { targetRegion, contentVariant } = personalization;

  const messages: Record<string, { ko: any; en: any; ar: any }> = {
    'middle-east-b2b': {
      ko: {
        title: '중동 지역 B2B 파트너',
        subtitle: '석유화학 플랜트 전문 | 24시간 AI 견적 지원'
      },
      en: {
        title: 'Your Middle East B2B Partner',
        subtitle: 'Oil & Gas Plant Specialist | 24/7 AI Quote Support'
      },
      ar: {
        title: 'شريكك في B2B في الشرق الأوسط',
        subtitle: 'متخصص في مصانع النفط والغاز | دعم عروض الأسعار بالذكاء الاصطناعي 24/7'
      }
    },
    'asia-pacific-b2b': {
      ko: {
        title: '아시아-태평양 B2B 네트워크',
        subtitle: '제조업 및 건설 전문 | AI 기반 글로벌 공급망'
      },
      en: {
        title: 'Asia-Pacific B2B Network',
        subtitle: 'Manufacturing & Construction Expert | AI-Powered Global Supply Chain'
      },
      ar: {
        title: 'شبكة B2B في منطقة آسيا والمحيط الهادئ',
        subtitle: 'خبير في التصنيع والبناء | سلسلة توريد عالمية بالذكاء الاصطناعي'
      }
    },
    'e-commerce': {
      ko: {
        title: '프리미엄 산업용품 직구',
        subtitle: '3M 정품 | EXACT 독일 프리미엄 | 당일배송'
      },
      en: {
        title: 'Premium Industrial Products Direct',
        subtitle: '3M Genuine | EXACT German Premium | Same-Day Delivery'
      },
      ar: {
        title: 'منتجات صناعية متميزة مباشرة',
        subtitle: '3M أصلي | EXACT ألماني متميز | توصيل في نفس اليوم'
      }
    }
  };

  // Select message based on region and content variant
  let messageKey = 'e-commerce';
  if (targetRegion === 'Middle East' && contentVariant === 'global-b2b') {
    messageKey = 'middle-east-b2b';
  } else if (targetRegion === 'Asia-Pacific' && contentVariant === 'global-b2b') {
    messageKey = 'asia-pacific-b2b';
  }

  const localeKey = (locale as 'ko' | 'en' | 'ar') || 'en';
  return messages[messageKey][localeKey] || messages['e-commerce']['en'];
}
