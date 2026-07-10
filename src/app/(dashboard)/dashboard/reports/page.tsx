'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { StatCard } from '@/components/widgets/stat-card';

interface ApiInvoice {
  invoiceDate: string;
  grandTotal: number;
  status: string;
  cgst: number;
  sgst: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildChartData(invoices: ApiInvoice[]) {
  const now = new Date();
  const months: number[] = Array(6).fill(0);
  const labels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(MONTH_LABELS[d.getMonth()]);
  }
  for (const inv of invoices) {
    const d = new Date(inv.invoiceDate);
    const monthDiff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
    if (monthDiff >= 0 && monthDiff < 6) {
      months[5 - monthDiff] += Number(inv.grandTotal);
    }
  }
  return {
    labels,
    datasets: [{
      label: 'Revenue',
      data: months,
      borderColor: 'rgb(255, 176, 38)',
      backgroundColor: 'rgba(255, 176, 38, 0.1)',
      tension: 0.3,
    }],
  };
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [reportType, setReportType] = useState('sales-summary');
  const [allInvoices, setAllInvoices] = useState<ApiInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<ApiInvoice[]>([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/invoices')
      .then(r => r.ok ? r.json() : { invoices: [] })
      .then(data => {
        const list = Array.isArray(data.invoices) ? data.invoices : [];
        setAllInvoices(list);
        setFilteredInvoices(list);
        setGenerated(true);
      })
      .catch(() => {});
  }, []);

  const handleGenerateReport = () => {
    setLoading(true);
    const result = allInvoices.filter(inv => {
      if (dateRange.start && inv.invoiceDate < dateRange.start) return false;
      if (dateRange.end && inv.invoiceDate > dateRange.end) return false;
      return true;
    });
    setFilteredInvoices(result);
    setGenerated(true);
    setLoading(false);
  };

  const totalRevenue = filteredInvoices.reduce((s, i) => s + Number(i.grandTotal), 0);
  const paidCount = filteredInvoices.filter(i => i.status === 'PAID').length;
  const avgSaleValue = filteredInvoices.length > 0 ? totalRevenue / filteredInvoices.length : 0;
  const gstCollected = filteredInvoices.reduce((s, i) => s + Number(i.cgst || 0) + Number(i.sgst || 0), 0);

  const reportTypes = [
    { value: 'sales-summary', label: 'Sales Summary' },
    { value: 'product-performance', label: 'Product Performance' },
    { value: 'customer-analysis', label: 'Customer Analysis' },
    { value: 'gst-report', label: 'GST Report' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate and view business reports"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/dashboard/reports' },
        ]}
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <label className="text-text-muted text-sm">Date Range:</label>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))}
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-text-muted text-sm">Type:</label>
            <Select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              options={reportTypes}
              placeholder="Select report type"
            />
          </div>
          <Button variant="primary" onClick={handleGenerateReport} loading={loading}>
            Generate Report
          </Button>
        </div>
      </PageHeader>

      {generated && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="success" />
            <StatCard title="Total Invoices" value={String(filteredInvoices.length)} color="primary" />
            <StatCard title="Avg. Invoice Value" value={`₹${avgSaleValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="info" />
            <StatCard title="GST Collected" value={`₹${gstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="warning" />
          </div>

          <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Revenue Trend (Last 6 Months)</h3>
            <div className="h-96">
              <RevenueChart data={buildChartData(filteredInvoices)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
