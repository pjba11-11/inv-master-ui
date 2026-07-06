'use client';

import { StatCard } from '@/components/widgets/stat-card';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { InvoicesTable } from '@/components/widgets/invoices-table';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  // Sample data - in a real app, this would come from an API
  const stats = [
    {
      title: 'Total Invoices',
      value: '124',
      trend: {
        value: '+12%',
        isPositive: true
      },
      icon: null, // Would be an icon component
      color: 'primary'
    },
    {
      title: 'Total Revenue',
      value: '$24,500',
      trend: {
        value: '+8%',
        isPositive: true
      },
      icon: null,
      color: 'success'
    },
    {
      title: 'Outstanding',
      value: '$3,200',
      trend: {
        value: '-5%',
        isPositive: false
      },
      icon: null,
      color: 'warning'
    },
    {
      title: 'Active Customers',
      value: '42',
      trend: {
        value: '+3%',
        isPositive: true
      },
      icon: null,
      color: 'info'
    }
  ];

  // Sample chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [1200, 1900, 3000, 2500, 2800, 3200],
        borderColor: 'rgb(255, 176, 38)', // primary-400
        backgroundColor: 'rgba(255, 176, 38, 0.1)',
        tension: 0.3
      }
    ]
  };

  // Sample table data
  const tableData = [
    {
      id: 1,
      number: 'INV-001',
      date: '2023-05-15',
      customerName: 'Acme Corp',
      amount: 1500.00,
      status: 'paid'
    },
    {
      id: 2,
      number: 'INV-002',
      date: '2023-05-16',
      customerName: 'Widget Inc',
      amount: 750.00,
      status: 'pending'
    },
    {
      id: 3,
      number: 'INV-003',
      date: '2023-05-17',
      customerName: 'Gadget Ltd',
      amount: 2200.00,
      status: 'draft'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-surface-1 via-surface-1 to-surface-2 rounded-xl border border-surface-2 p-6 shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/5 to-transparent pointer-events-none rounded-xl"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-6 text-text-primary">Monthly Revenue</h3>
            <RevenueChart data={chartData} />
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="relative overflow-hidden bg-gradient-to-br from-surface-1 via-surface-2 to-surface-3 rounded-xl border border-surface-2 p-6 shadow-lg hover:shadow-2xl transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/3 via-transparent to-transparent pointer-events-none rounded-xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-text-primary">Recent Invoices</h3>
                <p className="text-sm text-text-muted">Last 5 invoices</p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Navigate to create invoice
                }}
              >
                New Invoice
              </Button>
            </div>
            <InvoicesTable
              data={tableData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
