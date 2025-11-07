'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 md:py-16">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&q=80"
          alt="산업 현장"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span>{t('badge')}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-center space-y-2 mb-4">
            <div className="text-5xl md:text-7xl font-bold tracking-tight">
              {t('title')}
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-center text-slate-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            <span className="font-bold text-indigo-600">{t('subtitle_3m')}</span> - {t('subtitle_3m_desc')}<br className="hidden md:block" />
            <span className="font-semibold text-orange-600">{t('subtitle_exact')}</span> - {t('subtitle_exact_desc')}<br className="hidden md:block" />
            <span className="font-semibold text-purple-600">{t('subtitle_ai')}</span> {t('subtitle_ai_desc')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="min-w-[200px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/50 transition-all hover:scale-105"
              asChild
            >
              <Link href="/products">
                {t('cta_catalog')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[200px] border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-105"
              asChild
            >
              <Link href="/contact">
                <Zap className="mr-2 h-5 w-5" />
                {t('cta_quote')}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  24/7
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">AI 영업 시스템</div>
            </div>

            <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  3M
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">공식 파트너</div>
            </div>

            <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-orange-500 mr-2" />
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  글로벌
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600">B2B 네트워크</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
