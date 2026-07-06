'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { ProductForm } from '@/components/forms/product-form';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [product, setProduct] = useState(null);
  const [products, setProductsState] = useState(mockProducts);

  useEffect(() => {
    const prod = mockProducts.find(p => p.id === id);
    setProduct(prod || null);
  }, [id]);

  if (!product) {
    // If product not found, redirect to list
    router.push('/dashboard/products');
    return null;
  }

  const handleSubmit = async (data: any) => {
    startTransition(() => {
      // Simulate API call
      const updatedProducts = products.map(p =>
        p.id === id ? { ...p, ...data } : p
      );
      setProductsState(updatedProducts);
      setProduct(prev => prev ? { ...prev, ...data } : prev);
    });
    // After transition, redirect to list page
    router.push('/dashboard/products');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        description={`Editing product: ${product?.name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Edit Product', href: `/dashboard/products/edit/${id}` }
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
            initialData={product}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
}