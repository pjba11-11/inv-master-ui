import { TopCustomerResponse } from '@/types/dashboard';

interface TopCustomersTableProps {
  customers: TopCustomerResponse[];
}

export const TopCustomersTable = ({ customers }: TopCustomersTableProps) => {
  if (customers.length === 0) {
    return <p className="text-text-muted text-sm text-center py-6">No customer activity in this period.</p>;
  }

  return (
    <div className="divide-y divide-surface-2">
      {customers.map((c, i) => (
        <div key={c.customerId} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-text-muted">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{c.customerName}</p>
              <p className="text-xs text-text-muted">{c.invoiceCount} invoice{c.invoiceCount === 1 ? '' : 's'}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-text-primary shrink-0">
            ₹{c.revenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </p>
        </div>
      ))}
    </div>
  );
};
