'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';

// Mock data - in a real app, this would come from an API
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    sku: 'WM-001',
    category: 'Electronics',
    unitPrice: 29.99,
    taxable: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    sku: 'OC-005',
    category: 'Furniture',
    unitPrice: 199.99,
    taxable: true,
    isActive: true
  },
  {
    id: '3',
    name: 'Notebook A4',
    description: 'Pack of 5 ruled notebooks, A4 size',
    sku: 'NB-A4-5',
    category: 'Stationery',
    unitPrice: 12.50,
    taxable: false,
    isActive: true
  }
];

export default function ProductViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const prod = mockProducts.find(p => p.id === id);
    setProduct(prod || null);
  }, [id]);

  if (!product) {
    // If product not found, redirect to list
    router.push('/dashboard/products');
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Details"
        description={`Viewing product: ${product?.name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Product Details', href: `/dashboard/products/${id}` }
        ]}
      >
        <div className="flex justify-between items-start">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Products
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/products/edit/${id}`)}
          >
            Edit Product
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card>
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Product Information</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-text-muted">Product Name</p>
                  <p className="text-text-primary">{product.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-muted">SKU</p>
                  <p className="text-text-primary">{product.sku}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-muted">Category</p>
                  <p className="text-text-primary">{product.category}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-muted">Description</p>
                  <p className="text-text-primary">{product.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-muted">Unit Price</p>
                  <p className="text-text-primary font-medium">${product.unitPrice.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-muted">Taxable</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.taxable ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                    {product.taxable ? 'Yes' : 'No'}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-muted">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}