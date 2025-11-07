import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: '대동 (Daedong) - AI 기반 글로벌 비즈니스 포털',
    template: '%s | 대동',
  },
  description: '3M 제품 및 전동공구 전문 유통 - AI 기반 B2B 솔루션',
  keywords: ['3M', '전동공구', 'B2B', '유통', '대동'],
  authors: [{ name: 'Daedong' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://daedong.com',
    siteName: '대동',
    title: '대동 - AI 기반 글로벌 비즈니스 포털',
    description: '3M 제품 및 전동공구 전문 유통',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
