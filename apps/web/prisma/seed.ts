import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시드 시작...');

  // 기존 데이터 삭제 (개발 환경에서만)
  await prisma.quoteRequest.deleteMany({});
  await prisma.lead.deleteMany({});

  // 샘플 리드 데이터 생성
  const leads = await Promise.all([
    // 긴급 리드 - B2B 파트너십
    prisma.lead.create({
      data: {
        sessionId: 'session-001',
        name: '김철수',
        company: 'ABC 건설',
        email: 'kim@abcconstruction.kr',
        phone: '+82-10-1234-5678',
        country: 'South Korea',
        inquiryType: 'b2b',
        message: '3M VHB 테이프 대량 구매 및 장기 파트너십 논의하고 싶습니다.',
        chatHistory: JSON.stringify([
          { role: 'user', content: '3M 제품 대량 구매 상담 가능한가요?' },
          { role: 'assistant', content: '네, 가능합니다. 어떤 제품에 관심이 있으신가요?' },
        ]),
        source: 'chatbot',
        status: 'NEW',
        priority: 'URGENT',
        aiScore: 95,
        aiSummary: 'B2B 파트너십 요청 - 3M 제품 대량 구매, 건설 업체, 고가치 리드',
        ipAddress: '211.xxx.xxx.xxx',
        locale: 'ko',
      },
    }),

    // 긴급 리드 - 대량 견적
    prisma.lead.create({
      data: {
        sessionId: 'session-002',
        name: 'Ahmed Al-Maktoum',
        company: 'Dubai Industrial Supply',
        email: 'ahmed@dubaisu pply.ae',
        phone: '+971-50-xxx-xxxx',
        country: 'UAE',
        inquiryType: 'quote',
        message: 'Need bulk order of EXACT pipe cutting equipment for oil & gas project',
        source: 'chatbot',
        status: 'NEW',
        priority: 'URGENT',
        aiScore: 92,
        aiSummary: '중동 대량 주문 - EXACT 파이프 커팅 장비, 석유/가스 프로젝트',
        ipAddress: '185.xxx.xxx.xxx',
        locale: 'en',
      },
    }),

    // 높은 우선순위 - 제품 문의
    prisma.lead.create({
      data: {
        sessionId: 'session-003',
        name: '박영희',
        company: '대한 산업',
        email: 'park@daehan.co.kr',
        phone: '+82-10-9876-5432',
        country: 'South Korea',
        inquiryType: 'product',
        message: 'EXACT PipeCut 360 Pro 구매 검토 중',
        source: 'quote_form',
        status: 'CONTACTED',
        priority: 'HIGH',
        aiScore: 78,
        aiSummary: 'EXACT 장비 구매 검토 - 중견 기업, 즉시 구매 가능성',
        ipAddress: '121.xxx.xxx.xxx',
        locale: 'ko',
      },
    }),

    // 중간 우선순위 - 일반 문의
    prisma.lead.create({
      data: {
        sessionId: 'session-004',
        name: 'John Smith',
        company: 'Smith Engineering',
        email: 'john@smitheng.com',
        phone: '+1-555-0123',
        country: 'USA',
        inquiryType: 'product',
        message: 'Interested in 3M abrasives for metal fabrication',
        source: 'chatbot',
        status: 'QUALIFIED',
        priority: 'MEDIUM',
        aiScore: 65,
        aiSummary: '3M 연마재 관심 - 금속 가공 업체',
        ipAddress: '192.xxx.xxx.xxx',
        locale: 'en',
      },
    }),

    // 전환 완료 리드
    prisma.lead.create({
      data: {
        sessionId: 'session-005',
        name: '이민준',
        company: '한국 설비',
        email: 'lee@hanseol.kr',
        phone: '+82-10-5555-1234',
        country: 'South Korea',
        inquiryType: 'quote',
        message: 'EXACT 장비 10대 구매 완료',
        source: 'quote_form',
        status: 'CONVERTED',
        priority: 'HIGH',
        aiScore: 88,
        aiSummary: '10대 구매 완료 - EXACT 장비',
        ipAddress: '175.xxx.xxx.xxx',
        locale: 'ko',
      },
    }),

    // 낮은 우선순위 - 정보 요청
    prisma.lead.create({
      data: {
        sessionId: 'session-006',
        name: '최지훈',
        email: 'choi@gmail.com',
        country: 'South Korea',
        inquiryType: 'support',
        message: '제품 카탈로그 요청',
        source: 'chatbot',
        status: 'NEW',
        priority: 'LOW',
        aiScore: 35,
        aiSummary: '일반 정보 요청 - 카탈로그',
        ipAddress: '58.xxx.xxx.xxx',
        locale: 'ko',
      },
    }),

    // 추가 리드들...
    prisma.lead.create({
      data: {
        sessionId: 'session-007',
        name: 'Mohammed Hassan',
        company: 'Saudi Petrochemical',
        email: 'mhasssan@saudipetro.sa',
        phone: '+966-50-xxx-xxxx',
        country: 'Saudi Arabia',
        inquiryType: 'b2b',
        message: 'Interested in becoming exclusive distributor',
        source: 'chatbot',
        status: 'CONTACTED',
        priority: 'URGENT',
        aiScore: 90,
        aiSummary: '독점 유통 파트너십 문의 - 사우디 석유화학',
        ipAddress: '37.xxx.xxx.xxx',
        locale: 'ar',
      },
    }),

    prisma.lead.create({
      data: {
        sessionId: 'session-008',
        name: '강민수',
        company: '테크노 솔루션',
        email: 'kang@technosol.kr',
        phone: '+82-2-xxx-xxxx',
        country: 'South Korea',
        inquiryType: 'product',
        message: '3M 안전장비 벌크 주문',
        source: 'quote_form',
        status: 'QUALIFIED',
        priority: 'MEDIUM',
        aiScore: 72,
        aiSummary: '3M 안전장비 대량 주문 검토',
        ipAddress: '14.xxx.xxx.xxx',
        locale: 'ko',
      },
    }),
  ]);

  console.log(`✅ ${leads.length}개의 리드 생성 완료`);

  // 샘플 견적 요청 데이터 생성
  const quotes = await Promise.all([
    // EXACT 장비 견적
    prisma.quoteRequest.create({
      data: {
        sessionId: 'quote-001',
        productType: 'exact-pipecut',
        pipeMaterial: 'stainless',
        pipeDiameter: '100-360mm',
        quantity: 5,
        requirements: '스테인리스 파이프 절단용, 현장 작업 가능한 모델 선호',
        estimatedPriceMin: 60000,
        estimatedPriceMax: 80000,
        currency: 'USD',
        aiRecommendations: JSON.stringify([
          'EXACT PipeCut 360 Pro - 100-360mm 범위에 최적, 스테인리스 가능',
          'INOX 시리즈 추가 고려 - 스테인리스 전용 (+$2,000)',
          '5대 구매시 15% 할인 적용 가능',
        ]),
        name: '김철수',
        company: 'ABC 건설',
        email: 'kim@abcconstruction.kr',
        phone: '+82-10-1234-5678',
        country: 'South Korea',
        status: 'PENDING',
      },
    }),

    prisma.quoteRequest.create({
      data: {
        sessionId: 'quote-002',
        productType: 'exact-pipecut',
        pipeMaterial: 'steel',
        pipeDiameter: '200-460mm',
        quantity: 10,
        requirements: 'Heavy-duty cutting for large diameter pipes, battery model preferred',
        estimatedPriceMin: 180000,
        estimatedPriceMax: 240000,
        currency: 'USD',
        aiRecommendations: JSON.stringify([
          'EXACT PipeCut 460 Pro - 대구경 파이프 전용',
          '배터리 모델 (+$2,000/대)',
          '10대 구매시 20% 할인 = $36,000-$48,000 절감',
        ]),
        name: 'Ahmed Al-Maktoum',
        company: 'Dubai Industrial Supply',
        email: 'ahmed@dubaisupply.ae',
        phone: '+971-50-xxx-xxxx',
        country: 'UAE',
        status: 'PROCESSING',
      },
    }),

    // 3M 제품 견적
    prisma.quoteRequest.create({
      data: {
        sessionId: 'quote-003',
        productType: '3m-tape',
        quantity: 100,
        requirements: 'VHB 구조용 테이프, 진동 흡수용',
        estimatedPriceMin: 5000,
        estimatedPriceMax: 15000,
        currency: 'USD',
        aiRecommendations: JSON.stringify([
          '3M VHB Tape 4950 - 구조용 접착, 진동 흡수 우수',
          'VHB 5952 - 금속/플라스틱 접착',
          '100롤 구매시 10% 할인',
        ]),
        name: '박영희',
        company: '대한 산업',
        email: 'park@daehan.co.kr',
        phone: '+82-10-9876-5432',
        country: 'South Korea',
        status: 'SENT',
      },
    }),

    prisma.quoteRequest.create({
      data: {
        sessionId: 'quote-004',
        productType: 'exact-consumables',
        quantity: 50,
        requirements: 'Cutting blades for stainless steel pipes',
        estimatedPriceMin: 4000,
        estimatedPriceMax: 10000,
        currency: 'USD',
        aiRecommendations: JSON.stringify([
          'EXACT 스테인리스용 블레이드 - $80-200/개',
          '50개 구매시 25% 할인',
          '롤러 시스템 포함 추천',
        ]),
        name: 'John Smith',
        company: 'Smith Engineering',
        email: 'john@smitheng.com',
        phone: '+1-555-0123',
        country: 'USA',
        status: 'ACCEPTED',
      },
    }),

    prisma.quoteRequest.create({
      data: {
        sessionId: 'quote-005',
        productType: '3m-abrasives',
        quantity: 200,
        requirements: 'Cubitron II sanding discs for metal finishing',
        estimatedPriceMin: 6000,
        estimatedPriceMax: 20000,
        currency: 'USD',
        aiRecommendations: JSON.stringify([
          '3M Cubitron II - 금속 연마에 최적',
          '다양한 그릿 제공 (36-120)',
          '200박스 구매시 특별 가격',
        ]),
        name: '이민준',
        company: '한국 설비',
        email: 'lee@hanseol.kr',
        phone: '+82-10-5555-1234',
        country: 'South Korea',
        status: 'PENDING',
      },
    }),

    prisma.quoteRequest.create({
      data: {
        sessionId: 'quote-006',
        productType: 'exact-pipecut',
        pipeMaterial: 'plastic',
        pipeDiameter: '50-170mm',
        quantity: 3,
        requirements: '플라스틱 파이프 절단, 경량 모델',
        estimatedPriceMin: 10500,
        estimatedPriceMax: 13500,
        currency: 'USD',
        aiRecommendations: JSON.stringify([
          'EXACT PipeCut 170E - 경량 배터리 모델',
          '플라스틱 파이프 절단에 적합',
          '3대 구매시 10% 할인',
        ]),
        name: '강민수',
        company: '테크노 솔루션',
        email: 'kang@technosol.kr',
        phone: '+82-2-xxx-xxxx',
        country: 'South Korea',
        status: 'PENDING',
      },
    }),
  ]);

  console.log(`✅ ${quotes.length}개의 견적 요청 생성 완료`);

  console.log('\n🎉 시드 데이터 생성 완료!');
  console.log(`   - 리드: ${leads.length}개`);
  console.log(`   - 견적: ${quotes.length}개`);
  console.log('\n👉 http://localhost:3000/ko/admin 에서 확인하세요\n');
}

main()
  .catch((e) => {
    console.error('❌ 시드 실행 중 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
