'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { MaterialForm } from '@/components/forms/material-form';
import { useRouter } from 'next/navigation';

export default function AddMaterialPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push('/dashboard/materials');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Material"
        description="Create a new material record"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' },
          { label: 'Add Material', href: '/dashboard/materials/add' },
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>Back to Materials</Button>
      </PageHeader>

      <MaterialForm onSubmit={handleSubmit} isEditMode={false} />
    </div>
  );
}
