'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Handshake,
  FileText,
  Package,
  Wrench,
  HelpCircle,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

type InquiryType = 'b2b' | 'quote' | 'product' | 'support' | 'other';

export default function ContactPage() {
  const t = useTranslations('contact');
  const tFooter = useTranslations('footer');
  const [selectedType, setSelectedType] = useState<InquiryType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const inquiryTypes = [
    {
      id: 'b2b' as InquiryType,
      icon: Handshake,
      title: t('type_b2b'),
      desc: t('type_b2b_desc'),
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'quote' as InquiryType,
      icon: FileText,
      title: t('type_quote'),
      desc: t('type_quote_desc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'product' as InquiryType,
      icon: Package,
      title: t('type_product'),
      desc: t('type_product_desc'),
      color: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'support' as InquiryType,
      icon: Wrench,
      title: t('type_support'),
      desc: t('type_support_desc'),
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'other' as InquiryType,
      icon: HelpCircle,
      title: t('type_other'),
      desc: t('type_other_desc'),
      color: 'from-slate-500 to-slate-600'
    }
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      // Reset form after success
      setTimeout(() => {
        setSubmitStatus('idle');
        setSelectedType(null);
        (e.target as HTMLFormElement).reset();
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Inquiry Type Selection & Contact Info */}
              <div className="lg:col-span-1 space-y-8">
                {/* Inquiry Type Selection */}
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {t('type_title')}
                  </h2>
                  <div className="space-y-3">
                    {inquiryTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedType === type.id
                              ? 'border-indigo-500 bg-indigo-50 shadow-md'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 mb-1">
                                {type.title}
                              </div>
                              <div className="text-sm text-slate-600">
                                {type.desc}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Info */}
                <Card className="p-6 bg-slate-50 border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {t('info_title')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-700">
                          {t('info_email')}
                        </div>
                        <div className="text-sm text-slate-600">
                          {tFooter('email')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-700">
                          {t('info_phone')}
                        </div>
                        <div className="text-sm text-slate-600">
                          {tFooter('phone')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-700">
                          {t('info_address')}
                        </div>
                        <div className="text-sm text-slate-600">
                          {tFooter('address')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-700">
                          {t('info_hours')}
                        </div>
                        <div className="text-sm text-slate-600">
                          {t('info_hours_value')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Chatbot CTA */}
                <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0">
                  <MessageCircle className="h-10 w-10 mb-3" />
                  <h3 className="text-lg font-bold mb-2">
                    {t('ai_chat_title')}
                  </h3>
                  <p className="text-sm text-white/90">
                    {t('ai_chat_desc')}
                  </p>
                </Card>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-2">
                <Card className="p-8 bg-white border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {t('form_title')}
                  </h2>

                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <p className="text-sm text-green-800">
                        {t('form_success')}
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        {t('form_error')}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inquiry Type (Hidden) */}
                    <input type="hidden" name="type" value={selectedType || ''} />

                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-slate-700">
                        {t('form_name')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        placeholder={t('form_name_placeholder')}
                        className="mt-2"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <Label htmlFor="company" className="text-slate-700">
                        {t('form_company')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        required
                        placeholder={t('form_company_placeholder')}
                        className="mt-2"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-slate-700">
                          {t('form_email')} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder={t('form_email_placeholder')}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-slate-700">
                          {t('form_phone')}
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder={t('form_phone_placeholder')}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <Label htmlFor="country" className="text-slate-700">
                        {t('form_country')}
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder={t('form_country_placeholder')}
                        className="mt-2"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-slate-700">
                        {t('form_message')} <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder={t('form_message_placeholder')}
                        className="mt-2"
                        rows={6}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={!selectedType || isSubmitting}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white h-12 text-base font-semibold"
                    >
                      {isSubmitting ? t('form_submitting') : t('form_submit')}
                    </Button>

                    {!selectedType && (
                      <p className="text-sm text-slate-500 text-center">
                        문의 유형을 먼저 선택해주세요
                      </p>
                    )}
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
