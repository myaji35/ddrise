'use client';

import { Shield, Clock, TrendingUp, Wrench, Globe, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function FeaturesSection() {
  const t = useTranslations('features');

  const features = [
    {
      icon: Shield,
      title: t('3m_certification'),
      description: t('3m_certification_desc'),
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Wrench,
      title: t('exact_partner'),
      description: t('exact_partner_desc'),
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: t('ai_quote'),
      description: t('ai_quote_desc'),
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Globe,
      title: t('delivery_record'),
      description: t('delivery_record_desc'),
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: t('industry_expertise'),
      description: t('industry_expertise_desc'),
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Clock,
      title: t('express_delivery'),
      description: t('express_delivery_desc'),
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            {t('section_badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-triple">{t('section_title')}</span>
          </h2>
          <p className="text-lg text-slate-600">
            {t('section_subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
