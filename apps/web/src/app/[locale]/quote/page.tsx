import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { QuoteRequestForm } from '@/components/quote/QuoteRequestForm';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function QuotePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <QuoteRequestForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
