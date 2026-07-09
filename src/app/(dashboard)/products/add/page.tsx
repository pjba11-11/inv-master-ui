'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { ProductForm } from '@/components/forms/product-form';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/dashboard/products');
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
          { label: 'Add Product', href: '/dashboard/products/add' },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Products</Button>
      </PageHeader>

      <ProductForm onSubmit={handleSubmit} isEditMode={false} />
    </div>
  );
}
