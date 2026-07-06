'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { StatCard } from '@/components/widgets/stat-card';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [reportType, setReportType] = useState('sales-summary');
  // Chart data format for RevenueChart
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 1200, 900, 1500, 1800, 1500],
        borderColor: 'rgb(255, 176, 38)', // primary-400
        backgroundColor: 'rgba(255, 176, 38, 0.1)',
        tension: 0.3,
      },
    ],
  });

  const handleGenerateReport = () => {
    // In a real app, this would fetch data based on date range and report type
    // For demo, we'll just update the chart with some random data
    const newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 2000));
    setChartData({
      ...chartData,
      datasets: [
        {
          ...chartData.datasets[0],
          data: newData,
        },
      ],
    });
  };

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
        description="Generate and view various business reports"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/dashboard/reports' }
        ]}
      >
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <label className="text-text-muted">Date Range:</label>
            <div className="flex space-x-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                placeholder="Start date"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                placeholder="End date"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <label className="text-text-muted">Report Type:</label>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportTypes}
              placeholder="Select report type"
            />
          </div>

          <Button variant="primary" onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$12,450"
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value="124"
          trend={{ value: '+8%', isPositive: true }}
        />
        <StatCard
          title="Avg. Sale Value"
          value="$100.40"
          trend={{ value: '+5%', isPositive: true }}
        />
        <StatCard
          title="GST Collected"
          value="$1,245"
          trend={{ value: '+10%', isPositive: true }}
        />
      </div>

      {/* Chart */}
      <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
        <h3 className="text-lg font-semibold mb-4 text-text-primary">Revenue Trend</h3>
        <div className="h-96">
          <RevenueChart data={chartData} />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" size="sm">
          Export CSV
        </Button>
        <Button variant="outline" size="sm">
          Export PDF
        </Button>
      </div>
    </div>
  );
}