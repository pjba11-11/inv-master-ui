'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { DetailSkeleton, TableSkeleton } from '@/components/ui/skeleton';
import { useParams, useRouter } from 'next/navigation';

interface Product {
  productId: number;
  productName: string;
  description: string;
  active: boolean;
  manufacturingCost: number;
  sellingPrice: number;
  profitMargin: number;
  materials: { materialId: number; materialName: string; unit: string; hsnCode: string; currentPrice: number }[];
  createdByName?: string;
}

export default function ProductViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="space-y-6"><PageHeader title="Product" /><DetailSkeleton fields={5} /><TableSkeleton rows={3} cols={4} /></div>;

  if (!product) {
    router.push('/dashboard/products');
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Details"
        description={`Viewing: ${product.productName}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Product Details', href: `/dashboard/products/${id}` },
        ]}
      >
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/products/edit/${id}`)}>Edit</Button>
        </div>
      </PageHeader>

      <Card>
        <div className="space-y-6">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Product Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-text-muted">Product Name</p>
              <p className="text-text-primary">{product.productName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Status</p>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${product.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                {product.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-muted">Description</p>
              <p className="text-text-primary">{product.description || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Manufacturing Cost</p>
              <p className="text-text-primary font-medium">₹{Number(product.manufacturingCost).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Selling Price</p>
              <p className="text-text-primary font-medium">₹{Number(product.sellingPrice).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Profit Margin</p>
              <p className="text-primary-500 font-semibold text-lg">{Number(product.profitMargin).toFixed(1)}%</p>
            </div>
            {product.createdByName && (
              <div>
                <p className="text-sm font-medium text-text-muted">Created By</p>
                <p className="text-text-primary">{product.createdByName}</p>
              </div>
            )}
          </div>

          {product.materials?.length > 0 && (
            <div className="border-t border-surface-2 pt-6">
              <h3 className="text-base font-medium text-text-primary mb-4">Materials</h3>
              <table className="w-full border-spacing-0">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">Name</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">HSN</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">Unit</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-text-muted uppercase">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {product.materials.map(m => (
                    <tr key={m.materialId} className="hover:bg-surface-1">
                      <td className="px-3 py-3 text-text-primary">{m.materialName}</td>
                      <td className="px-3 py-3 text-text-primary">{m.hsnCode || '—'}</td>
                      <td className="px-3 py-3 text-text-primary">{m.unit}</td>
                      <td className="px-3 py-3 text-text-primary">₹{Number(m.currentPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
