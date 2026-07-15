'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatCard } from '@/components/widgets/stat-card';
import { InvoicesTable } from '@/components/widgets/invoices-table';
import { RevenueChart } from '@/components/widgets/revenue-chart';
import { TopProductsTable } from '@/components/widgets/top-products-table';
import { TopCustomersTable } from '@/components/widgets/top-customers-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { ErrorState } from '@/components/ui/error-state';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { DashboardPeriod, DashboardResponse, DASHBOARD_PERIOD_LABELS } from '@/types/dashboard';

interface ApiInvoice {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  grandTotal: number;
  status: string;
}

function mapStatus(s: string): 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' {
  if (s === 'PAID') return 'paid';
  if (s === 'CANCELLED') return 'overdue';
  return 'sent';
}

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Materials',
    description: 'Raw materials with unit prices',
    href: '/dashboard/materials',
    addHref: '/dashboard/materials/add',
    addLabel: 'Add Material',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    step: 2,
    title: 'Products',
    description: 'Bundle materials into sellable products',
    href: '/dashboard/products',
    addHref: '/dashboard/products/add',
    addLabel: 'Add Product',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    step: 3,
    title: 'Customers',
    description: 'Add the businesses you bill',
    href: '/dashboard/customers',
    addHref: '/dashboard/customers/add',
    addLabel: 'Add Customer',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    step: 4,
    title: 'Invoice',
    description: 'Create and send invoices',
    href: '/dashboard/invoices',
    addHref: '/dashboard/invoices/create',
    addLabel: 'Create Invoice',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const PERIOD_OPTIONS = (Object.keys(DASHBOARD_PERIOD_LABELS) as DashboardPeriod[]).map(value => ({
  value,
  label: DASHBOARD_PERIOD_LABELS[value],
}));

export default function DashboardPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [counts, setCounts] = useState({ materials: 0, products: 0, customers: 0, invoices: 0 });
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [period, setPeriod] = useState<DashboardPeriod>('LAST_MONTH');

  const fetchDashboard = () => {
    fetch('/api/dashboard')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: DashboardResponse) => setDashboard(data))
      .catch(() => setDashboardError('Could not load dashboard metrics.'))
      .finally(() => setDashboardLoading(false));
  };

  const retryDashboard = () => {
    setDashboardError('');
    setDashboardLoading(true);
    fetchDashboard();
  };

  useEffect(() => {
    fetchDashboard();

    fetch('/api/invoices')
      .then(r => r.ok ? r.json() : { invoices: [] })
      .then(data => {
        const list = Array.isArray(data.invoices) ? data.invoices : [];
        setInvoices(list.slice(0, 5));
        setCounts(prev => ({ ...prev, invoices: list.length }));
      })
      .catch(() => {});

    Promise.all([
      fetch('/api/materials').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/products').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/customers').then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([mats, prods, custs]) => {
      setCounts(prev => ({
        ...prev,
        materials: Array.isArray(mats) ? mats.length : 0,
        products: Array.isArray(prods) ? prods.length : 0,
        customers: Array.isArray(custs) ? custs.length : 0,
      }));
    });
  }, []);

  const stepCounts = [counts.materials, counts.products, counts.customers, counts.invoices];

  const tableInvoices = invoices.map(inv => ({
    id: String(inv.id),
    number: inv.invoiceNumber,
    date: inv.invoiceDate,
    customerName: inv.customerName || '—',
    amount: Number(inv.grandTotal),
    status: mapStatus(inv.status),
  }));

  // Find the first incomplete step to highlight
  const activeStep = stepCounts.findIndex(c => c === 0);
  const allStepsDone = stepCounts.every(c => c > 0);

  const selectedPeriod = dashboard?.periods.find(p => p.period === period) ?? null;

  const chartData = useMemo(() => {
    if (!selectedPeriod) return { labels: [], datasets: [] };
    return {
      labels: selectedPeriod.monthlyRevenue.map(m => m.month),
      datasets: [{
        label: 'Revenue',
        data: selectedPeriod.monthlyRevenue.map(m => m.revenue),
        borderColor: 'rgb(255, 176, 38)',
        backgroundColor: 'rgba(255, 176, 38, 0.1)',
      }],
    };
  }, [selectedPeriod]);

  return (
    <div className="space-y-8">
      {/* Workflow stepper — only shown until first-time setup is complete */}
      {!allStepsDone && (
      <div className="bg-surface-1 border border-surface-2 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-text-primary">Workflow</h2>
            <p className="text-xs text-text-muted mt-0.5">Follow these steps to create your first invoice</p>
          </div>
          <Link href="/dashboard/invoices/create">
            <Button variant="primary" size="sm">New Invoice</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((s, i) => {
            const count = stepCounts[i];
            const done = count > 0;
            const active = activeStep === i;
            return (
              <Link key={s.step} href={s.href} className="group block">
                <div className={`relative rounded-lg border p-4 transition-all ${
                  done
                    ? 'border-success/40 bg-success/5 hover:border-success/60'
                    : active
                    ? 'border-primary-500/60 bg-primary-500/5 hover:border-primary-500'
                    : 'border-surface-3 bg-surface-2 hover:border-surface-4'
                }`}>
                  {/* Step number + icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      done ? 'bg-success/20 text-success' : active ? 'bg-primary-500/20 text-primary-500' : 'bg-surface-3 text-text-muted'
                    }`}>
                      {done
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        : s.step}
                    </div>
                    <span className={`${done ? 'text-success' : active ? 'text-primary-500' : 'text-text-muted'}`}>
                      {s.icon}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-text-primary">{s.title}</p>
                  <p className="text-xs text-text-muted mt-0.5 mb-3">{s.description}</p>

                  {done ? (
                    <span className="text-xs text-success font-medium">{count} {count === 1 ? s.title.slice(0, -1).toLowerCase() : s.title.toLowerCase()}</span>
                  ) : (
                    <Link href={s.addHref} onClick={e => e.stopPropagation()}>
                      <Button variant={active ? 'primary' : 'secondary'} size="sm" className="w-full">{s.addLabel}</Button>
                    </Link>
                  )}

                  {/* Connector arrow (between cards) */}
                  {i < 3 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-4 w-4 items-center justify-center">
                      <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      )}

      {/* Metrics header + period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-primary">Business Metrics</h2>
          <p className="text-xs text-text-muted mt-0.5">Revenue, invoices, and top performers</p>
        </div>
        <div className="w-48">
          <Select
            value={period}
            onChange={e => setPeriod(e.target.value as DashboardPeriod)}
            options={PERIOD_OPTIONS}
          />
        </div>
      </div>

      {dashboardLoading ? (
        <StatCardSkeleton />
      ) : dashboardError ? (
        <ErrorState message={dashboardError} onRetry={retryDashboard} />
      ) : selectedPeriod ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Invoices" value={String(selectedPeriod.totalInvoices)} color="primary" href="/dashboard/invoices" />
            <StatCard
              title="Revenue"
              value={`₹${selectedPeriod.revenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
              color="success"
              trend={{
                value: `${selectedPeriod.growthPercentage >= 0 ? '+' : ''}${selectedPeriod.growthPercentage.toFixed(1)}%`,
                isPositive: selectedPeriod.growthPercentage >= 0,
              }}
              href="/dashboard/invoices"
            />
            <StatCard
              title="Outstanding"
              value={`₹${selectedPeriod.outstandingAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
              color="warning"
              href="/dashboard/invoices?status=GENERATED"
            />
            <StatCard
              title="Collected"
              value={`₹${selectedPeriod.collectedAmount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
              color="info"
              href="/dashboard/invoices?status=PAID"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-surface-1 rounded-xl border border-surface-2 p-6">
              <h3 className="text-base font-semibold text-text-primary mb-4">Monthly Revenue</h3>
              <RevenueChart data={chartData} />
            </div>
            <Card header={<h3 className="text-base font-semibold text-text-primary">Top Customers</h3>}>
              <TopCustomersTable customers={selectedPeriod.topCustomers} />
            </Card>
          </div>

          <Card header={<h3 className="text-base font-semibold text-text-primary">Top Products</h3>}>
            <TopProductsTable products={selectedPeriod.topProducts} />
          </Card>
        </>
      ) : null}

      {/* Recent Invoices */}
      {tableInvoices.length > 0 && (
        <div className="bg-surface-1 rounded-xl border border-surface-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Recent Invoices</h3>
              <p className="text-xs text-text-muted mt-0.5">Last {tableInvoices.length} invoices</p>
            </div>
            <Link href="/dashboard/invoices">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          <InvoicesTable
            invoices={tableInvoices}
            onSelectInvoice={id => router.push(`/dashboard/invoices/${id}`)}
          />
        </div>
      )}
    </div>
  );
}
