'use client';

import { useState } from 'react';
import CreateInvoiceStep1 from './page';
import CreateInvoiceStep2 from '../2/page';
import InvoiceReviewPage from '../review/page';

interface StepProps {
  step: string;
  customerId?: string;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function InvoiceCreateStep({
  params,
  onNext,
  onPrevious
}: {
  params: { step: string };
  onNext: (data: any) => void;
  onPrevious: () => void;
}) {
  const { step } = params;
  const [formData, setFormData] = useState<any>(null);

  // Handle step 1 (customer selection)
  if (step === '1' || step === undefined) {
    return (
      <CreateInvoiceStep1
        onNext={(customerId) => {
          // Navigate to step 2
          // In a real Next.js 14 app, we'd use router.push or redirect
          // For this demo, we'll simulate by calling onNext with step info
          onNext({ step: '2', customerId });
        }}
      />
    );
  }

  // Handle step 2 (item selection)
  if (step === '2') {
    // We need to get the customerId from somewhere - in a real app this would come from context/state
    // For demo, we'll use a placeholder or get it from URL state
    const customerId = '1'; // This should come from previous step

    return (
      <CreateInvoiceStep2
        customerId={customerId}
        onPrevious={() => {
          // Go back to step 1
          onPrevious();
        }}
        onNext={(formData) => {
          // Store the form data and go to step 3 (review)
          setFormData(formData);
          onNext({ step: '3' });
        }}
      />
    );
  }

  // Handle step 3 (review)
  if (step === '3' || step === 'review') {
    // Use the stored form data, or fallback to demo data if none available
    const displayData = formData || {
      customerId: '1',
      customerName: 'Acme Corp',
      customerEmail: 'info@acme.com',
      customerPhone: '+1 (555) 123-4567',
      customerAddress: '123 Business Ave, Suite 100\nNew York, NY 10001\nUSA',
      invoiceDate: '2023-05-15',
      dueDate: '2023-06-15',
      items: [
        { id: '1', description: 'Web Development Services', quantity: 10, rate: 100, tax: 15 },
        { id: '2', description: 'UI/UX Design', quantity: 5, rate: 150, tax: 15 },
        { id: '3', description: 'Project Management', quantity: 8, rate: 75, tax: 15 }
      ],
      discount: 10,
      taxRate: 15,
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days. Late payments subject to 1.5% monthly fee.'
    };

    return (
      <InvoiceReviewPage
        formData={displayData}
      />
    );
  }

  // Default fallback
  return <div className="p-6">Loading step {step}...</div>;
}