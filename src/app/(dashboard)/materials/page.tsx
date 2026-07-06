'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Mock data for materials
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

export default function MaterialsPage() {
  const [materials, setMaterials] = useState(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter materials based on search term
  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id));
      alert('Material deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materials"
        description="Manage your inventory materials"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' }
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/materials/add">
            <Button variant="primary">
              Add Material
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-48"
          />
        </div>
      </PageHeader>

      <div className="grid gap-6">
        <Card>
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Material List</h2>
            </div>
            {filteredMaterials.length > 0 ? (
              <table className="w-full border-spacing-0">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Unit</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Supplier</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {filteredMaterials.map(material => (
                    <tr key={material.id} className="hover:bg-surface-1">
                      <td className="px-4 py-4 text-text-primary>{material.name}</td>
                      <td className="px-4 py-4 text-text-primary>{material.description}</td>
                      <td className="px-4 py-4 text-text-primary>{material.unit}</td>
                      <td className="px-4 py-4 text-text-primary>${material.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 text-text-primary>{material.supplier || 'N/A'}</td>
                      <td className="px-4 py-4 text-text-primary>{material.isActive ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-4 text-sm space-x-2">
                        <Link href={`/dashboard/materials/${material.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/materials/edit/${material.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteMaterial(material.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">No materials found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}