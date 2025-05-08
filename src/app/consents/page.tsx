
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import DashboardCard from "@/components/ui/dashboard-card";
import Image from "next/image";

type Consent = {
  id: string;
  subject: string;
  status: "active" | "revoked" | "expired";
  granted_at: string;
  revoked_at: string | null;
  trustee: string;
  data_scope: string;
};

async function getConsentSummaryData(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from("consents")
    .select("status", { count: "exact", head: false });

  if (error) {
    return { active: 0, revoked: 0, expired: 0, total: 0 };
  }
  const summary = { active: 0, revoked: 0, expired: 0, total: 0 };
  data.forEach((row: any) => {
    summary[row.status] = (summary[row.status] || 0) + 1;
    summary.total += 1;
  });
  return summary;
}

async function getConsentTableData(supabase: ReturnType<typeof createClient>): Promise<Consent[]> {
  const { data, error } = await supabase
    .from("consents")
    .select("id, subject, status, granted_at, revoked_at, trustee, data_scope")
    .order("granted_at", { ascending: false });

  if (error || !data) return [];
  return data as Consent[];
}

export default async function ConsentsDashboardPage() {
  const supabase = createClient();

  const [summary, consents] = await Promise.all([
    getConsentSummaryData(supabase),
    getConsentTableData(supabase)
  ]);

  return (
    <main className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Consent Dashboard</h1>
      <p className="text-gray-500 mb-8">
        View and manage consent records granted to your organization.
      </p>
      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Active Consents"
          icon="shield"
          count={summary.active}
          variant="primary"
        />
        <DashboardCard
          title="Revoked Consents"
          icon="ban"
          count={summary.revoked}
          variant="error"
        />
        <DashboardCard
          title="Expired Consents"
          icon="clock"
          count={summary.expired}
          variant="warning"
        />
        <DashboardCard
          title="Total Consents"
          icon="list"
          count={summary.total}
          variant="neutral"
        />
      </section>

      {/* Table */}
      <section className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Subject</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Trustee</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Scope</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Granted At</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Revoked At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {consents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  <Image
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=400"
                    alt="No consents"
                    width={80}
                    height={80}
                    className="mx-auto mb-4 rounded-full"
                  />
                  No consents found.
                </td>
              </tr>
            ) : (
              consents.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{c.subject}</td>
                  <td className="px-4 py-3">{c.trustee}</td>
                  <td className="px-4 py-3">{c.data_scope}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium " +
                        (c.status === "active"
                          ? "bg-green-100 text-green-700"
                          : c.status === "revoked"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-yellow-50 text-yellow-700")
                      }
                    >
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(c.granted_at).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {c.revoked_at
                      ? new Date(c.revoked_at).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
