import { AdminLayout } from '@/components/admin/AdminLayout';
import { prisma } from '@/lib/prisma';
import { FileText, DollarSign, Package, Calendar, Building2, Mail } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getQuotes() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
    return quotes;
  } catch (error) {
    console.error('Failed to fetch quotes:', error);
    return [];
  }
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SENT: 'bg-purple-100 text-purple-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export default async function AdminQuotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const quotes = await getQuotes();

  return (
    <AdminLayout locale={locale}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quote Requests</h2>
            <p className="text-slate-600 mt-1">
              {quotes.length} quote{quotes.length !== 1 ? 's' : ''} requested
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              Total: {quotes.length}
            </span>
          </div>
        </div>

        {/* Quotes grid */}
        {quotes.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {quotes.map((quote) => {
              const avgPrice = quote.estimatedPriceMin && quote.estimatedPriceMax
                ? Math.round((quote.estimatedPriceMin + quote.estimatedPriceMax) / 2)
                : null;

              let recommendations: string[] = [];
              try {
                recommendations = quote.aiRecommendations
                  ? JSON.parse(quote.aiRecommendations)
                  : [];
              } catch (e) {
                // Ignore parsing errors
              }

              return (
                <div
                  key={quote.id}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-indigo-600" />
                        <h3 className="font-semibold text-slate-900">
                          {quote.productType}
                        </h3>
                      </div>
                      {quote.pipeMaterial && quote.pipeDiameter && (
                        <p className="text-sm text-slate-600">
                          {quote.pipeMaterial} • {quote.pipeDiameter}
                          {quote.quantity && ` • Qty: ${quote.quantity}`}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusColors[quote.status]
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  {/* Price estimation */}
                  {avgPrice && (
                    <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-indigo-600 font-medium mb-1">
                            ESTIMATED PRICE
                          </p>
                          <p className="text-2xl font-bold text-indigo-900">
                            ${avgPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-indigo-600 mt-1">
                            ${quote.estimatedPriceMin?.toLocaleString()} - $
                            {quote.estimatedPriceMax?.toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-indigo-400" />
                      </div>
                    </div>
                  )}

                  {/* AI Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-600 mb-2">
                        AI RECOMMENDATIONS:
                      </p>
                      <ul className="space-y-1">
                        {recommendations.slice(0, 3).map((rec, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-indigo-600">•</span>
                            <span className="flex-1">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Requirements */}
                  {quote.requirements && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-600 mb-1">
                        REQUIREMENTS:
                      </p>
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {quote.requirements}
                      </p>
                    </div>
                  )}

                  {/* Customer info */}
                  <div className="border-t border-slate-200 pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {quote.name || 'Anonymous'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {quote.company && (
                      <p className="text-sm text-slate-600">{quote.company}</p>
                    )}

                    {quote.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <a
                          href={`mailto:${quote.email}`}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          {quote.email}
                        </a>
                      </div>
                    )}

                    {quote.country && (
                      <p className="text-xs text-slate-500">📍 {quote.country}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No quote requests yet
            </h3>
            <p className="text-slate-600">
              Quote requests will appear here when customers use the AI Quote form.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
