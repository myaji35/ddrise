'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Shield, Wrench, Zap, ArrowRight, Package, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function ProductsPage() {
  const t = useTranslations('products');

  const categories = [
    {
      title: t('3m_title'),
      description: t('3m_description'),
      icon: Shield,
      color: 'from-blue-500 to-indigo-500',
      items: [
        '3M VHB 구조용 테이프',
        '3M 큐비트론II 연마재',
        '3M Scotch-Weld 접착제',
        '3M 방진마스크 & 안전보호구',
      ],
      link: '/products/3m',
    },
    {
      title: t('exact_title'),
      description: t('exact_description'),
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
      items: [
        'EXACT PipeCut 170E (경량 모델)',
        'EXACT PipeCut 280/360/460 Pro',
        'EXACT Infinity (무제한 직경)',
        'EXACT 배터리/공압 모델',
      ],
      link: '/products/exact',
    },
    {
      title: t('ai_title'),
      description: t('ai_description'),
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      items: [
        'AI 기반 견적 시스템',
        '실시간 재고 확인',
        '24/7 자동 응답',
        '맞춤형 제품 추천',
      ],
      link: '/contact',
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-slate-50">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-semibold mb-6 shadow-sm">
                <Package className="inline h-4 w-4 mr-2" />
                {t('section_badge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
                {t('section_title')}
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                {t('section_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-lg border border-slate-200 p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">
                      {category.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                      {category.description}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                      asChild
                    >
                      <Link href={category.link}>
                        {t('view_details')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t('featured_title')}
              </h2>
              <p className="text-xl text-slate-400">
                {t('featured_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* 3M VHB Tape */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <Package className="h-16 w-16 text-slate-300" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t('product_3m_vhb_title')}</h4>
                <p className="text-sm text-slate-400 mb-4">
                  {t('product_3m_vhb_desc')}
                </p>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/products/3m">{t('view_product')}</Link>
                </Button>
              </div>

              {/* EXACT PipeCut */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <Wrench className="h-16 w-16 text-slate-300" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t('product_exact_title')}</h4>
                <p className="text-sm text-slate-400 mb-4">
                  {t('product_exact_desc')}
                </p>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/products/exact">{t('view_product')}</Link>
                </Button>
              </div>

              {/* AI Quote System */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-all">
                <div className="aspect-square bg-white/5 rounded-lg mb-4 flex items-center justify-center">
                  <Zap className="h-16 w-16 text-slate-300" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t('product_ai_title')}</h4>
                <p className="text-sm text-slate-400 mb-4">
                  {t('product_ai_desc')}
                </p>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/contact">{t('request_quote')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center bg-slate-900 rounded-lg p-12 text-white shadow-lg border border-slate-800">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t('cta_title')}
              </h2>
              <p className="text-xl mb-8 text-slate-300">
                {t('cta_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100 min-w-[200px]"
                  asChild
                >
                  <Link href="/contact">
                    <Zap className="mr-2 h-5 w-5" />
                    {t('cta_ai_quote')}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 min-w-[200px]"
                  asChild
                >
                  <Link href="/admin/products">
                    {t('cta_admin')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
