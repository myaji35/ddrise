'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Wrench, CheckCircle, Award, Zap, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import NextImage from 'next/image';

export default function ExactProductsPage() {
  const t = useTranslations('products.exact');
  const tCommon = useTranslations('products');

  const products = [
    {
      category: t('category_light'),
      items: [
        {
          title: t('pipecut_170_title'),
          description: t('pipecut_170_desc'),
          specs: '직경: Ø15-170mm | 벽 두께: 8mm (철강) | 무게: 경량 디자인',
          icon: Wrench,
          image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80'
        },
      ],
    },
    {
      category: t('category_pro'),
      items: [
        {
          title: t('pipecut_280_title'),
          description: t('pipecut_280_desc'),
          specs: '직경: Ø50-280mm | 벽 두께: 12mm | 모터: 2200W',
          icon: Wrench,
          image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&q=80'
        },
        {
          title: t('pipecut_360_title'),
          description: t('pipecut_360_desc'),
          specs: '직경: Ø100-360mm | 벽 두께: 20mm | 레이저 가이드',
          icon: Award,
          image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80'
        },
        {
          title: t('pipecut_460_title'),
          description: t('pipecut_460_desc'),
          specs: '직경: Ø200-460mm | 벽 두께: 20mm | 모터: 2500W',
          icon: Wrench,
          image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80'
        },
      ],
    },
    {
      category: t('category_special'),
      items: [
        {
          title: t('infinity_title'),
          description: t('infinity_desc'),
          specs: '무제한 직경 | 특수 대형 파이프 | 맞춤형 솔루션',
          icon: Zap,
          image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&q=80'
        },
        {
          title: t('inox_title'),
          description: t('inox_desc'),
          specs: '스테인리스 전용 블레이드 | 정밀 절단 | 버 제거',
          icon: Package,
          image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&q=80'
        },
      ],
    },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: t('feature_precision'),
      description: t('feature_precision_desc'),
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Award,
      title: t('feature_german'),
      description: t('feature_german_desc'),
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Zap,
      title: t('feature_battery'),
      description: t('feature_battery_desc'),
      color: 'from-pink-500 to-purple-500',
    },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-semibold mb-6 shadow-sm">
                <Wrench className="inline h-4 w-4 mr-2" />
                {t('hero_badge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
                {t('hero_title')}
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                {t('hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                  asChild
                >
                  <Link href="/contact">{tCommon('request_quote')}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                  asChild
                >
                  <Link href="/products">{tCommon('view_details')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products by Category */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {products.map((category, idx) => (
                <div key={idx} className="mb-16">
                  <h2 className="text-3xl font-bold mb-8 text-slate-800">
                    {category.category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((product, index) => {
                      const Icon = product.icon;
                      return (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                          {/* Product Image */}
                          <div className="relative h-48 bg-slate-50">
                            <NextImage
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 text-slate-800">
                              {product.title}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                              {product.description}
                            </p>

                            {/* Specifications */}
                            <div className="pt-4 border-t border-slate-200">
                              <p className="text-xs text-slate-500 font-semibold mb-2">주요 사양</p>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {product.specs}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t('features_title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all"
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-orange-200 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center bg-slate-900 rounded-lg p-12 text-white shadow-lg border border-slate-800">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {tCommon('cta_title')}
              </h2>
              <p className="text-xl mb-8 text-slate-300">
                {tCommon('cta_subtitle')}
              </p>
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 min-w-[200px]"
                asChild
              >
                <Link href="/contact">{tCommon('cta_ai_quote')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
