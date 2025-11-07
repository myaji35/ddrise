'use client';

import { Award, Globe, Target, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TrustSection() {
  const t = useTranslations('trust');

  const stats = [
    {
      icon: Award,
      value: '3M',
      label: t('3m_cert'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Globe,
      value: t('global_network'),
      label: t('global_network_desc'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      value: '24/7',
      label: 'AI 운영 시스템',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      value: '1,000+',
      label: '제품 라인업',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const platforms = [
    'Amazon FBA', 'Shopify', '쿠팡', '스마트스토어', 'Lazada',
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
            {t('section_badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t('section_title')}
          </h2>
          <p className="text-lg text-indigo-200">
            {t('section_subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-indigo-200 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* E-commerce Platforms */}
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-indigo-300 mb-8 uppercase tracking-wider">
            글로벌 이커머스 채널
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="text-lg font-bold text-white/90">
                  {platform}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-indigo-300 mt-6">
            AI가 모든 채널을 24시간 모니터링하며 자동 운영합니다
          </p>
        </div>
      </div>
    </section>
  );
}
