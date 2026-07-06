'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Mock data for products
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    sku: 'WM-001',
    category: 'Electronics',
    unitPrice: 29.99,
    taxable: true,
    isActive: true
  },
  {
    id: '2',
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support',
    sku: 'OC-005',
    category: 'Furniture',
    unitPrice: 199.99,
    taxable: true,
    isActive: true
  },
  {
    id: '3',
    name: 'Notebook A4',
    description: 'Pack of 5 ruled notebooks, A4 size',
    sku: 'NB-A4-5',
    category: 'Stationery',
    unitPrice: 12.50,
    taxable: false,
    isActive: true
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      alert('Product deleted successfully!');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Products', href: '/dashboard/products' }
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/dashboard/products/add">
            <Button variant="primary">
              Add Product
            </Button>
          </Link>
          <Input
            type="search"
            placeholder="Search products..."
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
              <h2 className="text-lg font-medium text-text-primary">Product List</h2>
            </div>
            {filteredProducts.length > 0 ? (
              <table className="w-full border-spacing-0">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">SKU</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Unit Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Taxable</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-surface-1">
                      <td className="px-4 py-4 text-text-primary>{product.name}</td>
                      <td className="px-4 py-4 text-text-primary>{product.sku}</td>
                      <td className="px-4 py-4 text-text-primary>{product.category}</td>
                      <td className="px-4 py-4 text-text-primary>${product.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-4 text-text-primary>{product.taxable ? 'Yes' : 'No'}</td>
                      <td className="px-4 py-4 text-text-primary>{product.isActive ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-4 text-sm space-x-2">
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/products/edit/${product.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
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
                <p className="text-text-muted">No products found</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}