import { AdminLayout } from '@/components/admin/AdminLayout';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Phone, Building2, Globe, Calendar, TrendingUp } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 100,
    });
    return leads;
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return [];
  }
}

const priorityColors = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW: 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusColors = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-purple-100 text-purple-700',
  QUALIFIED: 'bg-green-100 text-green-700',
  CONVERTED: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-slate-100 text-slate-700',
};

export default async function AdminLeadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const leads = await getLeads();

  return (
    <AdminLayout locale={locale}>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Leads Management</h2>
            <p className="text-slate-600 mt-1">
              {leads.length} lead{leads.length !== 1 ? 's' : ''} captured
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              Total: {leads.length}
            </span>
          </div>
        </div>

        {/* Leads table */}
        {leads.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Lead Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">
                            {lead.name || 'Anonymous'}
                          </p>
                          {lead.company && (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Building2 className="h-3 w-3" />
                              {lead.company}
                            </div>
                          )}
                          {lead.country && (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Globe className="h-3 w-3" />
                              {lead.country}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Mail className="h-3 w-3" />
                              <a
                                href={`mailto:${lead.email}`}
                                className="hover:text-indigo-600"
                              >
                                {lead.email}
                              </a>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <Phone className="h-3 w-3" />
                              <a
                                href={`tel:${lead.phone}`}
                                className="hover:text-indigo-600"
                              >
                                {lead.phone}
                              </a>
                            </div>
                          )}
                          {!lead.email && !lead.phone && (
                            <span className="text-sm text-slate-400">No contact</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {lead.inquiryType || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${
                            priorityColors[lead.priority]
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            statusColors[lead.status]
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {lead.aiScore ? (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-indigo-600" />
                            <span className="text-sm font-medium text-slate-900">
                              {lead.aiScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No leads yet
            </h3>
            <p className="text-slate-600">
              Leads will appear here when visitors use the chatbot or contact form.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
