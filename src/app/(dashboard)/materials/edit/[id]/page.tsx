'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { MaterialForm } from '@/components/forms/material-form';
import { useParams, useRouter } from 'next/navigation';
import { useTransition } from 'react';

// Mock data - in a real app, this would come from an API
let mockMaterials = [
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

export default function EditMaterialPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [material, setMaterial] = useState(null);
  const [materials, setMaterialsState] = useState(mockMaterials);

  useEffect(() => {
    const mat = mockMaterials.find(m => m.id === id);
    setMaterial(mat || null);
  }, [id]);

  if (!material) {
    // If material not found, redirect to list
    router.push('/dashboard/materials');
    return null;
  }

  const handleSubmit = async (data: any) => {
    startTransition(() => {
      // Simulate API call
      const updatedMaterials = materials.map(m =>
        m.id === id ? { ...m, ...data } : m
      );
      setMaterialsState(updatedMaterials);
      setMaterial(prev => prev ? { ...prev, ...data } : prev);
    });
    // After transition, redirect to list page
    router.push('/dashboard/materials');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Material"
        description={`Editing material: ${material?.name}`}
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' },
          { label: 'Edit Material', href: `/dashboard/materials/edit/${id}` }
        ]}
      >
        <Button variant="outline" onClick={() => router.back()}>
          Back to Materials
        </Button>
      </PageHeader>

      <div className="grid">
        <div className="col-span-1">
          <MaterialForm
            onSubmit={handleSubmit}
            initialData={material}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
}