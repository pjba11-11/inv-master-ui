'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { ProductForm } from '@/components/forms/product-form';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

// Mock data - in a real app, this would come from an API
let mockProducts = [
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

export default function AddProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState(mockProducts);

  const handleSubmit = async (data: any) => {
    startTransition(() => {
      // Simulate API call
      const newProduct = {
        ...data,
        id: Date.now().toString(),
      };
      setProducts([...products, newProduct]);
    });
    // After transition, redirect to list page
    router.push('/dashboard/products');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        description="Create a new product"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Add Product', href: '/dashboard/products/add' }
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>
          Back to Products
        </Button>
      </PageHeader>

      <div className="grid">
        <div className="col-span-1">
          <ProductForm
            onSubmit={handleSubmit}
            isEditMode={false}
          />
        </div>
      </div>
    </div>
  );
}