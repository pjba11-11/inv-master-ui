'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import Link from 'next/link';

interface Product {
  productId: number;
  productName: string;
  description: string;
  active: boolean;
  manufacturingCost: number;
  sellingPrice: number;
  profitMargin: number;
  materials: { materialId: number; materialName: string; unit: string; hsnCode: string; currentPrice: number }[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setError(''); setLoading(true);
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Failed to load products.'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    setDeleting(true);
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter(p => p.productId !== id));
    setConfirmDeleteId(null);
    setDeleting(false);
  };

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product catalog">
        <Link href="/dashboard/products/add"><Button variant="primary">Add Product</Button></Link>
      </PageHeader>
      <TableSkeleton rows={5} cols={7} />
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/products/add">
            <Button variant="primary">Add Product</Button>
          </Link>
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
      </PageHeader>

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Product List</h2>
          </div>
          {filtered.length > 0 ? (
            <table className="w-full border-spacing-0">
              <thead>
                <tr className="bg-surface-2">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Mfg. Cost</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Selling Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Margin</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Materials</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {filtered.map(p => (
                  <tr key={p.productId} className="hover:bg-surface-1">
                    <td className="px-4 py-4 text-text-primary font-medium">{p.productName}</td>
                    <td className="px-4 py-4 text-text-primary">₹{Number(p.manufacturingCost).toFixed(2)}</td>
                    <td className="px-4 py-4 text-text-primary">₹{Number(p.sellingPrice).toFixed(2)}</td>
                    <td className="px-4 py-4 text-text-primary">{Number(p.profitMargin).toFixed(1)}%</td>
                    <td className="px-4 py-4 text-text-primary">{p.materials?.length ?? 0}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/products/${p.productId}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/dashboard/products/edit/${p.productId}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        {confirmDeleteId === p.productId ? (
                          <>
                            <Button variant="destructive" size="sm" loading={deleting} onClick={() => handleDelete(p.productId)}>Confirm?</Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <Button variant="destructive" size="sm" onClick={() => setConfirmDeleteId(p.productId)}>Delete</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title={searchTerm ? 'No results match your search' : 'No products yet'}
              description={searchTerm ? 'Try a different search term.' : 'Add your first product to get started.'}
              action={!searchTerm ? <Link href="/dashboard/products/add"><Button variant="primary" size="sm">Add Product</Button></Link> : undefined}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
