import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Handshake,
  Package,
  Wrench,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Link } from '@/i18n/routing';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function GlobalBusinessPage() {
  const t = useTranslations('global_business');
  const tCommon = useTranslations('common');

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 sm:py-32">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-sm font-semibold">
                {t('hero_badge')}
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                {t('hero_title')}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                {t('hero_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                {t('intro_title')}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('intro_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Models */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('models_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 mb-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('model_distributor_title')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('model_distributor_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('model_oem_title')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('model_oem_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-16 h-16 mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <Wrench className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('model_project_title')}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t('model_project_desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('capabilities_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <Badge className="mb-4 bg-red-500 text-white">3M Official</Badge>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('capability_3m_title')}
                  </h3>
                  <p className="text-slate-700">
                    {t('capability_3m_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <Badge className="mb-4 bg-blue-600 text-white">EXACT Partner</Badge>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('capability_exact_title')}
                  </h3>
                  <p className="text-slate-700">
                    {t('capability_exact_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                  <Badge className="mb-4 bg-indigo-600 text-white flex items-center gap-1 w-fit">
                    <Sparkles className="h-3 w-3" />
                    AI Powered
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('capability_ai_title')}
                  </h3>
                  <p className="text-slate-700">
                    {t('capability_ai_desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('process_title')}
              </h2>
              <div className="space-y-6">
                {[
                  { step: '1', title: t('process_step1'), desc: t('process_step1_desc') },
                  { step: '2', title: t('process_step2'), desc: t('process_step2_desc') },
                  { step: '3', title: t('process_step3'), desc: t('process_step3_desc') },
                  { step: '4', title: t('process_step4'), desc: t('process_step4_desc') },
                  { step: '5', title: t('process_step5'), desc: t('process_step5_desc') },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Regions */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('regions_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-shadow">
                  <MapPin className="h-10 w-10 text-orange-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('region_middle_east')}
                  </h3>
                  <p className="text-slate-600">
                    {t('region_middle_east_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-shadow">
                  <MapPin className="h-10 w-10 text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('region_asia')}
                  </h3>
                  <p className="text-slate-600">
                    {t('region_asia_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-shadow">
                  <MapPin className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('region_europe')}
                  </h3>
                  <p className="text-slate-600">
                    {t('region_europe_desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                {t('cta_title')}
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                {t('cta_desc')}
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 text-lg px-8 py-6 h-auto">
                  {t('cta_button')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
