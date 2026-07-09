'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';

interface Material {
  id: number;
  materialName: string;
  unit: string;
  currentPrice: number;
  active: boolean;
}

export default function MaterialViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/materials/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setMaterial(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-8 text-text-muted">Loading...</div>;

  if (!material) {
    router.push('/dashboard/materials');
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Material Details"
        description={`Viewing: ${material.materialName}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' },
          { label: 'Material Details', href: `/dashboard/materials/${id}` },
        ]}
      >
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
          <Button variant="outline" onClick={() => router.push(`/dashboard/materials/edit/${id}`)}>Edit</Button>
        </div>
      </PageHeader>

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Material Information</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-text-muted">Material Name</p>
              <p className="text-text-primary">{material.materialName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Unit</p>
              <p className="text-text-primary">{material.unit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Current Price</p>
              <p className="text-text-primary font-medium">₹{Number(material.currentPrice).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-muted">Status</p>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${material.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                {material.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
