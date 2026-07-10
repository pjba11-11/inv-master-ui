import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  number: string;
  date: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
}

interface InvoicesTableProps {
  invoices: Invoice[];
  onSelectInvoice?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
}

export const InvoicesTable = ({ 
  invoices = [], 
  onSelectInvoice,
  onMarkAsPaid
}: InvoicesTableProps) => {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted">No invoices found</p>
      </div>
    );
  }

  // Status badge variants
  const getStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'paid': return 'success';
      case 'overdue': return 'error';
      case 'draft': return 'secondary';
      case 'sent': 
      case 'viewed': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-spacing-0">
          <thead>
            <tr className="bg-surface-2">
              <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">
                Invoice #
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">
                Amount
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-2">
            {invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className="hover:bg-surface-3 transition-colors cursor-pointer"
                onClick={() => onSelectInvoice?.(invoice.id)}
              >
                <td className="px-4 py-4 text-sm font-medium text-text-primary">
                  #{invoice.number}
                </td>
                <td className="px-4 py-4 text-sm text-text-primary">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-text-primary">
                  {invoice.customerName}
                </td>
                <td className="px-4 py-4 text-sm text-text-primary font-medium">
                  ${invoice.amount.toFixed(2)}
                </td>
                <td className="px-4 py-4 text-sm">
                  <Badge 
                    variant={getStatusVariant(invoice.status)}
                    className="text-xs px-2.5 py-0.5"
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  {onMarkAsPaid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsPaid(invoice.id);
                      }}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-sm text-text-muted">
        Showing {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
      </div>
    </div>
  );
};
