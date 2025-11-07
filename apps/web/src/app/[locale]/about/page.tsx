import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Sparkles, Globe, Award, Users } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations('common');

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20 sm:py-32">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold">
                {t('hero_badge')}
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                {t('hero_title')}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                {t('hero_subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  {t('mission_title')}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {t('mission_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('core_values_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-white border-slate-200">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('value_innovation')}
                  </h3>
                  <p className="text-slate-600">
                    {t('value_innovation_desc')}
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-white border-slate-200">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('value_trust')}
                  </h3>
                  <p className="text-slate-600">
                    {t('value_trust_desc')}
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-white border-slate-200">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('value_excellence')}
                  </h3>
                  <p className="text-slate-600">
                    {t('value_excellence_desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Partnerships */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('partnerships_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 hover:shadow-xl transition-shadow bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {t('partnership_3m_title')}
                      </h3>
                      <Badge className="bg-red-500 text-white">3M Official</Badge>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {t('partnership_3m_desc')}
                  </p>
                </Card>

                <Card className="p-8 hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {t('partnership_exact_title')}
                      </h3>
                      <Badge className="bg-blue-600 text-white">EXACT Partner</Badge>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {t('partnership_exact_desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
                {t('capabilities_title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-shadow">
                  <Sparkles className="h-10 w-10 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('capability_ai_title')}
                  </h3>
                  <p className="text-slate-600">
                    {t('capability_ai_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-shadow">
                  <Globe className="h-10 w-10 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('capability_global_title')}
                  </h3>
                  <p className="text-slate-600">
                    {t('capability_global_desc')}
                  </p>
                </Card>

                <Card className="p-8 bg-white border-slate-200 hover:shadow-xl transition-shadow">
                  <Users className="h-10 w-10 text-emerald-600 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {t('capability_expertise_title')}
                  </h3>
                  <p className="text-slate-600">
                    {t('capability_expertise_desc')}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              {t('stats_title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2">2+</div>
                <div className="text-white/80">{t('stat_partners')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2">700+</div>
                <div className="text-white/80">{t('stat_products')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2">10+</div>
                <div className="text-white/80">{t('stat_countries')}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2">24/7</div>
                <div className="text-white/80">{t('stat_support')}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
