'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';

export default function CompaniesPage() {
  const [company, setCompany] = useState({
    name: 'Acme Corporation',
    gstNumber: 'GSTIN1234567890',
    email: 'info@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    currency: 'USD',
    taxPercentage: 10,
    invoicePrefix: 'INV'
  });

  const handleUpdate = async (data: any) => {
    // Simulate API call
    console.log('Updating company:', data);
    // In a real app, you'd make an API request here
    setCompany(prev => ({ ...prev, ...data }));
    alert('Company information updated successfully!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile"
        description="Manage your company information and settings"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Company Settings', href: '/dashboard/companies' }
        ]}
      >
        <Button variant="primary" onClick={() => {
          // In a real app, this would navigate to an edit page
          alert('Edit functionality would open here');
        }}>
          Edit Profile
        </Button>
      </PageHeader>
      
      <div className="grid gap-6">
        {/* Company Info Card */}
        <Card className="col-span-1 md:col-span-2">
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Company Information</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-text-muted">Company Name</p>
                <p className="text-text-primary">{company.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">GST Number</p>
                <p className="text-text-primary">{company.gstNumber}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Email</p>
                <p className="text-text-primary">{company.email}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Phone</p>
                <p className="text-text-primary">{company.phone}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Address</p>
                <p className="text-text-primary">
                  {company.address}, {company.city}, {company.state} {company.postalCode}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Country</p>
                <p className="text-text-primary">{company.country}</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Settings Card */}
        <Card className="col-span-1 md:col-span-2">
          <div className="space-y-4">
            <div className="border-b border-surface-2 pb-4">
              <h2 className="text-lg font-medium text-text-primary">Company Settings</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-text-muted">Currency</p>
                <p className="text-text-primary">${company.currency}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Tax Percentage</p>
                <p className="text-text-primary">{company.taxPercentage}%</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Invoice Prefix</p>
                <p className="text-text-primary">{company.invoicePrefix}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-muted">Financial Year Start</p>
                <p className="text-text-primary">April 1</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
