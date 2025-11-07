'use client';

import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');

  const footerLinks = {
    products: [
      { label: t('3m_solutions'), href: '/products/3m' },
      { label: t('exact_cutter'), href: '/products/exact' },
      { label: t('full_catalog'), href: '/products' },
    ],
    business: [
      { label: t('about_us'), href: '/about' },
      { label: t('global_b2b'), href: '/global-business' },
      { label: t('ai_solutions'), href: '/ai-solutions' },
      { label: t('ecommerce'), href: '/ecommerce' },
    ],
    support: [
      { label: t('ai_quote'), href: '/contact' },
      { label: t('product_inquiry'), href: '/inquiry' },
      { label: t('faq'), href: '/faq' },
      { label: t('partnership'), href: '/partnership' },
    ],
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                대동
              </span>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              <span className="font-semibold text-indigo-400">{t('company_desc_line1')}</span><br />
              {t('company_desc_line2')}<br />
              {t('company_desc_line3')}<br />
              {t('company_desc_line4')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-indigo-400" />
                <a href={`mailto:${t('email')}`} className="hover:text-indigo-400 transition-colors">
                  {t('email')}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-indigo-400" />
                <a href={`tel:${t('phone')}`} className="hover:text-indigo-400 transition-colors">
                  {t('phone')}
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-indigo-400 mt-1 flex-shrink-0" />
                <span>{t('address')}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('products_title')}</h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('business_title')}</h4>
            <ul className="space-y-3">
              {footerLinks.business.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('support_title')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} {t('copyright')}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                {t('terms')}
              </Link>
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                {t('privacy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
