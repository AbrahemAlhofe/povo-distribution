import { getRevenueMetrics, getInvoices } from "@/lib/database";
import { IndicatorCard } from "@/components/IndicatorCard";
import Lineicons from "@lineiconshq/react-lineicons";
import { DollarSolid, CheckCircle1Solid, HourglassSolid } from "@lineiconshq/free-icons";

export default async function RevenuesPage() {
  const metrics = await getRevenueMetrics();

  const revenueMetrics = [
    {
      label: "إجمالي الإيرادات",
      value: `$${(metrics.totalRevenue / 1000).toFixed(1)}K`,
      icon: <Lineicons icon={DollarSolid} size={24} color="blue" strokeWidth={1.5} />,
      changePercent: 0,
    },
    {
      label: "الإيرادات المدفوعة",
      value: `$${(metrics.totalPaidRevenue / 1000).toFixed(1)}K`,
      icon: <Lineicons icon={CheckCircle1Solid} size={24} color="green" strokeWidth={1.5} />,
      changePercent: 0,
    },
    {
      label: "الإيرادات المعلقة",
      value: `$${(metrics.totalUnpaidRevenue / 1000).toFixed(1)}K`,
      icon: <Lineicons icon={HourglassSolid} size={24} color="orange" strokeWidth={1.5} />,
      changePercent: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">الإيرادات</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {revenueMetrics.map((metric, index) => (
          <IndicatorCard
            key={index}
            label={metric.label}
            value={metric.value}
            icon={<span className="text-2xl">{metric.icon}</span>}
            changePercent={metric.changePercent}
          />
        ))}
      </div>
      {/* Invoices table */}
      <InvoicesTable />
    </div>
  );
}

async function InvoicesTable() {
  const invoices = await getInvoices(50);

  const formatDate = (d?: string) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="w-full rounded-xl bg-white shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 mt-8">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">الفواتير</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">رقم الفاتورة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">المبلغ</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">الحالة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">تاريخ الدفع</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">لا توجد فواتير</td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">{inv["Invoice ID"] ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">${(inv["Invoice Amount"] || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    {inv["Is Paid"] ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">مدفوع</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">معلق</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{formatDate(inv["Payment Date"])}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
