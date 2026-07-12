'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { FormSkeleton } from '@/components/ui/skeleton';
import { ProductForm } from '@/components/forms/product-form';
import { useParams, useRouter } from 'next/navigation';
import { WriteGuard } from '@/components/guards/write-guard';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setProduct(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/dashboard/products');
  };

  if (loading) return <div className="space-y-6"><PageHeader title="Edit Product" /><FormSkeleton fields={6} /></div>;
  if (!product) { router.push('/dashboard/products'); return null; }

  return (
    <WriteGuard redirectTo="/dashboard/products">
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        description={`Editing: ${product.productName}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' },
          { label: 'Edit Product', href: `/dashboard/products/edit/${id}` },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Products</Button>
      </PageHeader>

      <ProductForm
        onSubmit={handleSubmit}
        initialData={{
          productName: product.productName,
          description: product.description ?? '',
          hsnCode: product.hsnCode ?? '',
          labourCharges: product.labourCharges ?? 0,
          profitMargin: product.profitMargin ?? 0,
          active: product.active,
        }}
        initialMaterialIds={(product.materials ?? []).map((m: any) => m.materialId)}
        isEditMode={true}
      />
    </div>
    </WriteGuard>
  );
}
