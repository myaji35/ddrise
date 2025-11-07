'use client';

import { useState } from 'react';
import { Menu, X, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/global-business', label: t('global_business') },
    { href: '/quote', label: 'AI Quote' },
    { href: '/contact', label: t('contact') },
  ];

  const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    router.replace(pathname, { locale: langCode });
    setIsLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('company_name')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
            >
              <Globe className="h-4 w-4" />
              <span>{currentLang.flag}</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors flex items-center gap-3 ${
                      locale === lang.code ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-700'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-indigo-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-indigo-600" />
          ) : (
            <Menu className="h-6 w-6 text-indigo-600" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t bg-white/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-indigo-600 py-2 px-4 hover:bg-indigo-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Language Selector */}
            <div className="pt-2 border-t">
              <div className="text-xs font-semibold text-slate-500 px-4 mb-2 flex items-center gap-2">
                <Globe className="h-3 w-3" />
                Language
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleLanguageChange(lang.code);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors rounded-lg flex items-center gap-3 ${
                    locale === lang.code ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-700 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
