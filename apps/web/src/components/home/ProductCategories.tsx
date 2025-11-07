import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Package, Wrench, Sparkles, ArrowRight } from 'lucide-react';

export function ProductCategories() {
  const categories = [
    {
      title: '3M 산업용 솔루션',
      description: '테이프·접착제(VHB, 양면테이프, 전기절연), 연마재(큐비트론II, 샌딩디스크), 안전보호구(방진마스크, 보안경, 청력보호구), 자동차·전자산업용 특수 필름',
      icon: Package,
      href: '/products/3m',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&q=80',
    },
    {
      title: 'EXACT 파이프 커팅 시스템',
      description: '독일 프리미엄 브랜드 - PipeCut 170E~460 Pro Series, Infinity 무제한 직경 절단기, 배터리/공압 모델, 베벨링 전용기. 철강·스테인리스·플라스틱 파이프 15mm~410mm 대응',
      icon: Wrench,
      href: '/products/exact',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    },
    {
      title: 'AI 자동 견적 시스템',
      description: '제품명·파이프 직경·수량 입력 시 AI가 10,000+ 거래 데이터 학습으로 3초 내 견적 범위 제시. 배관·플랜트·건설 B2B 대량 주문 특화',
      icon: Sparkles,
      href: '/contact',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    },
  ];

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
            OUR SERVICES
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">주요 제품 카테고리</span>
          </h2>
          <p className="text-lg text-slate-600">
            산업 현장에 필요한 모든 제품을 한곳에서 만나보세요
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.href} href={category.href} className="group">
                <Card className={`h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br ${category.bgGradient} overflow-hidden relative`}>
                  {/* Product Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <CardHeader className="relative">
                    <CardTitle className="text-2xl font-bold mb-2">{category.title}</CardTitle>
                    <CardDescription className="text-base text-slate-600">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                      자세히 보기
                      <ArrowRight className="h-4 w-4 text-current" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <p className="text-slate-600 mb-4">
            <span className="font-semibold">3M 산업용 500종+</span>, <span className="font-semibold">EXACT 파이프 커터 전 라인업</span>, <span className="font-semibold">안전보호구 200종+</span> 보유
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 shadow-lg"
            >
              제품 카탈로그 PDF 다운로드
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              3초 만에 AI 견적 받기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
