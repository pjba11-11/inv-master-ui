'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { MaterialForm } from '@/components/forms/material-form';
import { useRouter } from 'next/navigation';
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

export default function AddMaterialPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [materials, setMaterials] = useState(mockMaterials);

  const handleSubmit = async (data: any) => {
    startTransition(() => {
      // Simulate API call
      const newMaterial = {
        ...data,
        id: Date.now().toString(),
      };
      setMaterials([...materials, newMaterial]);
    });
    // After transition, redirect to list page
    router.push('/dashboard/materials');
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
          { label: 'Add Material', href: '/dashboard/materials/add' }
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
            isEditMode={false}
          />
        </div>
      </div>
    </div>
  );
}