'use client';

import { Link } from 'next/link';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useForm } from '@/components/forms/use-form';

interface CustomerFormValues {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CreateInvoiceStep1Props {
  onNext: (customerId: string) => void;
}

export default function CreateInvoiceStep1({ onNext }: { onNext: (customerId: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerFormValues[]>([
    { id: '1', name: 'Acme Corp', email: 'info@acme.com', phone: '+1 (555) 123-4567' },
    { id: '2', name: 'Widget Inc', email: 'sales@widgetinc.com', phone: '+1 (555) 234-5678' },
    { id: '3', name: 'Gadget Ltd', email: 'contact@gadgetltd.com', phone: '+1 (555) 345-6789' },
    { id: '4', name: 'Tech Solutions', email: 'hello@techsolutions.com', phone: '+1 (555) 456-7890' },
    { id: '5', name: 'Global Enterprises', email: 'info@globalent.com', phone: '+1 (555) 567-8901' }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (customer: CustomerFormValues) => {
    setSelectedCustomerId(customer.id);
    onCustomerSelect(customer);
  };

  const onCustomerSelect = (customer: CustomerFormValues) => {
    // In a real app, we'd store this in context or pass it through props
    // For this demo, we'll just call the onNext callback with the customer ID
    onNext(customer.id);
  };

  return (
    <Card className="space-y-4">
      <div className="border-b border-surface-2 pb-4">
        <h2 className="text-lg font-medium text-text-primary">Step 1: Select Customer</h2>
        <p className="text-text-muted">Choose the customer for this invoice</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-text-muted mb-1">Search Customers</label>
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company name or email"
        />
      </div>

      <div className="space-y-3">
        {filteredCustomers.length === 0 ? (
          <p className="text-text-muted text-center py-4">No customers found</p>
        ) : (
          <>
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`flex items-center justify-between p-3 border rounded-lg hover:bg-surface-3 cursor-pointer transition-colors ${selectedCustomerId === customer.id ? 'border-primary-500 bg-primary-50' : ''}`}
                onClick={() => handleSelectCustomer(customer)}
              >
                <div className="flex-1">
                  <p className="font-medium text-text-primary">{customer.name}</p>
                  <p className="text-sm text-text-muted">{customer.email}</p>
                </div>
                <span className={`text-primary-500 ${selectedCustomerId === customer.id ? 'font-medium' : ''}`}>
                  {selectedCustomerId === customer.id ? 'Selected' : 'Select'}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            // In a real app, this would go back to invoices list
            // router.push('/dashboard/invoices');
            alert('Going back to invoices list');
          }}
        >
          Back to Invoices
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (selectedCustomerId) {
              // Navigate to step 2 (item selection)
              // In a real app with Next.js 14 app router, we'd use useRouter() or navigate via link
              // For this demo, we'll simulate by calling the onNext prop
              onNext(selectedCustomerId);
            } else {
              alert('Please select a customer to continue');
            }
          }}
          disabled={!selectedCustomerId}
        >
          Continue to Items
        </Button>
      </div>
    </Card>
  );
}