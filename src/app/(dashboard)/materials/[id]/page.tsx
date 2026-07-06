'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';

// Mock data - in a real app, this would come from an API
const mockMaterials = [
  {
    id: '1',
    name: 'Steel Rod',
    description: 'Carbon steel rod, 10mm diameter, 2m length',
    unit: 'kg',
    currentPrice: 15.50,
    supplier: 'SteelWorks Inc.',
    isActive: true
  },
  {
    id: '2',
    name: 'Copper Wire',
    description: 'Insulated copper wire, 12 AWG, 100m roll',
    unit: 'm',
    currentPrice: 2.75,
    supplier: 'ElectroSupply Co.',
    isActive: true
  },
  {
    id: '3',
    name: 'Plastic Sheet',
    description: 'PVC sheet, 4x8 ft, 3mm thickness',
    unit: 'sqm',
    currentPrice: 12.00,
    supplier: 'Plastics Plus',
    isActive: false
  }
];

export default function MaterialViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState(null);

  useEffect(() => {
    const mat = mockMaterials.find(m => m.id === id);
    setMaterial(mat || null);
  }, [id]);

  if (!material) {
    // If material not found, redirect to list
    router.push('/dashboard/materials');
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Material Details"
        description={`Viewing material: ${material?.name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' },
          { label: 'Material Details', href: `/dashboard/materials/${id}` }
        ]}
      >
        <div className="flex justify-between items-start">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Materials
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/materials/edit/${id}`)}
          >
            Edit Material
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-text-muted">Name</p>
                <p className="text-text-primary">{material.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">Description</p>
                <p className="text-text-primary">{material.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">Unit</p>
                <p className="text-text-primary">{material.unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">Current Price</p>
                <p className="text-text-primary">${material.currentPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">Supplier</p>
                <p className="text-text-primary">{material.supplier}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-text-muted">Status</p>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${material.isActive ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                  {material.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}