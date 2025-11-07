import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 지원하는 언어 목록
  locales: ['ko', 'en', 'ar'],

  // 기본 언어
  defaultLocale: 'ko',

  // URL에서 기본 언어 prefix를 숨김
  localePrefix: 'as-needed',
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
