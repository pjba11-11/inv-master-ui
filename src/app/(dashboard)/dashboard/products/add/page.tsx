'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { ProductForm } from '@/components/forms/product-form';
import { useRouter } from 'next/navigation';
import { WriteGuard } from '@/components/guards/write-guard';

export default function AddProductPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => {
    setError('');
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push('/dashboard/products');
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.message ?? body.error ?? `Failed to create product (${res.status})`);
    }
  };

  return (
    <WriteGuard redirectTo="/dashboard/products">
    <div className="space-y-6">
      <PageHeader
        title="Add Product"
        description="Create a new product"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Add Product', href: '/dashboard/products/add' },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Products</Button>
      </PageHeader>

      {error && <p className="text-sm text-error bg-error/10 rounded-lg px-4 py-3">{error}</p>}
      <ProductForm onSubmit={handleSubmit} isEditMode={false} />
    </div>
    </WriteGuard>
  );
}
