import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

// Vercel geo extension for NextRequest
interface NextRequestWithGeo extends NextRequest {
  geo?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: string;
    longitude?: string;
  };
}

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // IP 기반 지역 감지 (Vercel에서만 사용 가능)
  const country = (request as NextRequestWithGeo).geo?.country;

  // 사용자가 이미 locale을 선택했는지 확인
  const hasLocaleInPath = routing.locales.some((locale) =>
    request.nextUrl.pathname.startsWith(`/${locale}`)
  );

  // 만약 locale이 경로에 없고, IP 기반 국가 정보가 있다면
  if (!hasLocaleInPath && country) {
    // 국가별 기본 언어 매핑
    const countryToLocale: Record<string, string> = {
      KR: 'ko', // 한국
      US: 'en', // 미국
      GB: 'en', // 영국
      CA: 'en', // 캐나다
      AU: 'en', // 호주
      SA: 'ar', // 사우디아라비아
      AE: 'ar', // 아랍에미리트
      EG: 'ar', // 이집트
      // 기타 아랍어권 국가들
      QA: 'ar', // 카타르
      KW: 'ar', // 쿠웨이트
      BH: 'ar', // 바레인
      OM: 'ar', // 오만
      JO: 'ar', // 요르단
      LB: 'ar', // 레바논
    };

    const detectedLocale = countryToLocale[country] || routing.defaultLocale;

    // 쿠키에 감지된 locale 저장
    const response = handleI18nRouting(request);
    response.cookies.set('NEXT_LOCALE', detectedLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1년
      path: '/',
    });

    return response;
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next (Next.js internals)
  // - static files (images, etc.)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
