'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Material {
  id: number;
  materialName: string;
  unit: string;
  currentPrice: number;
  active: boolean;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/materials')
      .then(r => r.json())
      .then(data => { setMaterials(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = materials.filter(m =>
    m.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this material?')) return;
    await fetch(`/api/materials/${id}`, { method: 'DELETE' });
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  if (loading) return <div className="text-center py-8 text-text-muted">Loading...</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Materials"
        description="Manage your inventory materials"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Materials', href: '/dashboard/materials' },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/materials/add">
            <Button variant="primary">Add Material</Button>
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

      <Card>
        <div className="space-y-4">
          <div className="border-b border-surface-2 pb-4">
            <h2 className="text-lg font-medium text-text-primary">Material List</h2>
          </div>
          {filtered.length > 0 ? (
            <table className="w-full border-spacing-0">
              <thead>
                <tr className="bg-surface-2">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Unit</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-2">
                {filtered.map(m => (
                  <tr key={m.id} className="hover:bg-surface-1">
                    <td className="px-4 py-4 text-text-primary font-medium">{m.materialName}</td>
                    <td className="px-4 py-4 text-text-primary">{m.unit}</td>
                    <td className="px-4 py-4 text-text-primary">₹{Number(m.currentPrice).toFixed(2)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${m.active ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                        {m.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm space-x-2">
                      <Link href={`/dashboard/materials/${m.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/dashboard/materials/edit/${m.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(m.id)}>Delete</Button>
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
  );
}
