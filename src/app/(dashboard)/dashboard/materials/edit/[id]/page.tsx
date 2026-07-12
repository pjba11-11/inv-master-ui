'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { FormSkeleton } from '@/components/ui/skeleton';
import { MaterialForm } from '@/components/forms/material-form';
import { useParams, useRouter } from 'next/navigation';
import { WriteGuard } from '@/components/guards/write-guard';

export default function EditMaterialPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/materials/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setMaterial(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    const res = await fetch(`/api/materials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/dashboard/materials');
  };

  if (loading) return <div className="space-y-6"><PageHeader title="Edit Material" /><FormSkeleton fields={4} /></div>;
  if (!material) { router.push('/dashboard/materials'); return null; }

  return (
    <WriteGuard redirectTo="/dashboard/materials">
    <div className="space-y-6">
      <PageHeader
        title="Edit Material"
        description={`Editing: ${material.materialName}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' },
          { label: 'Edit Material', href: `/dashboard/materials/edit/${id}` },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Materials</Button>
      </PageHeader>

      <MaterialForm
        onSubmit={handleSubmit}
        initialData={{
          materialName: material.materialName,
          unit: material.unit,
          currentPrice: material.currentPrice,
          active: material.active,
        }}
        isEditMode={true}
      />
    </div>
    </WriteGuard>
  );
}
