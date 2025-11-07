import { AdminLayout } from '@/components/admin/AdminLayout';
import { prisma } from '@/lib/prisma';
import { TrendingUp, Users, FileText, DollarSign, AlertCircle } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch statistics
    const [totalLeads, todayLeads, totalQuotes, todayQuotes, urgentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      prisma.lead.findMany({
        where: {
          priority: 'URGENT',
          status: {
            in: ['NEW', 'CONTACTED'],
          },
        },
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    // Calculate average quote amount
    const quotes = await prisma.quoteRequest.findMany({
      select: {
        estimatedPriceMin: true,
        estimatedPriceMax: true,
      },
    });

    const avgQuoteAmount = quotes.length > 0
      ? quotes.reduce((sum, q) => {
          const avg = ((q.estimatedPriceMin || 0) + (q.estimatedPriceMax || 0)) / 2;
          return sum + avg;
        }, 0) / quotes.length
      : 0;

    return {
      totalLeads,
      todayLeads,
      totalQuotes,
      todayQuotes,
      avgQuoteAmount: Math.round(avgQuoteAmount),
      urgentLeads,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return {
      totalLeads: 0,
      todayLeads: 0,
      totalQuotes: 0,
      todayQuotes: 0,
      avgQuoteAmount: 0,
      urgentLeads: [],
    };
  }
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const stats = await getStats();

  const statCards = [
    {
      title: '총 리드 수',
      value: stats.totalLeads,
      change: `오늘 +${stats.todayLeads}`,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: '총 견적 수',
      value: stats.totalQuotes,
      change: `오늘 +${stats.todayQuotes}`,
      icon: FileText,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: '평균 견적 금액',
      value: `$${stats.avgQuoteAmount.toLocaleString()}`,
      change: 'USD',
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: '긴급 리드',
      value: stats.urgentLeads.length,
      change: '즉시 대응 필요',
      icon: AlertCircle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <AdminLayout locale={locale}>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">대시보드 개요</h2>
          <p className="text-slate-600 mt-1">
            리드와 견적을 실시간으로 모니터링하세요
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg border border-slate-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Urgent leads */}
        {stats.urgentLeads.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                즉시 대응이 필요한 긴급 리드
              </h3>
            </div>
            <div className="space-y-3">
              {stats.urgentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {lead.name || 'Anonymous'}
                      {lead.company && (
                        <span className="text-slate-600"> - {lead.company}</span>
                      )}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {lead.email || lead.phone || '연락처 정보 없음'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {lead.country && `📍 ${lead.country} • `}
                      {lead.inquiryType && `유형: ${lead.inquiryType}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                      {lead.priority}
                    </span>
                    {lead.aiScore && (
                      <span className="text-xs text-slate-500">
                        점수: {lead.aiScore}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {stats.totalLeads === 0 && stats.totalQuotes === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              아직 데이터가 없습니다
            </h3>
            <p className="text-slate-600">
              챗봇과 견적 폼을 통해 리드와 견적을 수집하기 시작하세요.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
