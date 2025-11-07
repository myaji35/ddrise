'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function CTASection() {
  const t = useTranslations('cta');

  return (
    <section className="py-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-xl md:text-2xl text-indigo-100 mb-6 leading-relaxed">
            {t('subtitle')}, {t('subtitle_ai')} <span className="font-bold text-white">{t('subtitle_count')}</span><br className="hidden md:block" />
            {t('subtitle_ai_desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="min-w-[240px] bg-white text-indigo-600 hover:bg-indigo-50 shadow-2xl text-lg h-14 font-semibold transition-all hover:scale-105"
              asChild
            >
              <Link href="/contact">
                <MessageSquare className="mr-2 h-5 w-5" />
                {t('button_quote')}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[240px] border-2 border-white text-white hover:bg-white/10 text-lg h-14 font-semibold transition-all hover:scale-105"
              asChild
            >
              <Link href="/global-business">
                {t('button_partnership')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-10 pt-10 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{t('trust_247')}</div>
                <div className="text-sm text-indigo-200">{t('trust_247_desc')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">{t('trust_3m')}</div>
                <div className="text-sm text-indigo-200">{t('trust_3m_desc')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">{t('trust_global')}</div>
                <div className="text-sm text-indigo-200">{t('trust_global_desc')}</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">{t('trust_realtime')}</div>
                <div className="text-sm text-indigo-200">{t('trust_realtime_desc')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
