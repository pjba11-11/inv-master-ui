'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPostalCode: string;
  companyCountry: string;
  gstNumber: string;
  industry: string;
  employeeCount: string;
  terms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stepError, setStepError] = useState('');
  const [success, setSuccess] = useState('');

  const [formValues, setFormValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    companyCity: '',
    companyState: '',
    companyPostalCode: '',
    companyCountry: '',
    gstNumber: '',
    industry: '',
    employeeCount: '',
    terms: false,
  });

  const handleChange = (field: keyof FormValues, value: string | boolean) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    setStepError('');
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formValues;
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      setStepError('Please fill in all personal information fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setStepError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 8) {
      setStepError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setStepError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const {
      companyName, companyEmail, companyPhone, companyAddress,
      companyCity, companyState, companyPostalCode, companyCountry
    } = formValues;
    if (!companyName || !companyEmail || !companyPhone || !companyAddress ||
        !companyCity || !companyState || !companyPostalCode || !companyCountry) {
      setStepError('Please fill in all company information fields.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(companyEmail)) {
      setStepError('Please enter a valid company email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setStepError('');
    if (activeStep === 1) {
      if (validateStep1()) setActiveStep(2);
      return;
    }
    if (activeStep === 2) {
      if (!validateStep2()) return;
      setActiveStep(3);
      return;
    }
    if (!formValues.terms) {
      setStepError('You must accept the Terms of Service to continue.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      setStepError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal', description: 'Your details' },
    { title: 'Company', description: 'Company info' },
    { title: 'Review', description: 'Confirm & submit' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface-0)' }}>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="text-text-muted">Get started with InvoiceGen</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold shrink-0 ${
                activeStep > i + 1 ? 'bg-success text-white' : activeStep === i + 1 ? 'bg-primary-500 text-white' : 'bg-surface-3 text-text-muted'
              }`}>{activeStep > i + 1 ? '✓' : i + 1}</div>
              <span className={activeStep === i + 1 ? 'text-text-primary font-medium' : 'text-text-muted'}>{step.title}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-surface-3" />}
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}
        >
          {/* Step 1: Personal */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                  <Input value={formValues.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                  <Input value={formValues.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                <Input type="email" value={formValues.email} onChange={e => handleChange('email', e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
                <Input type="tel" value={formValues.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <Input type="password" value={formValues.password} onChange={e => handleChange('password', e.target.value)} placeholder="Min 8 characters" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Confirm Password</label>
                <Input type="password" value={formValues.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} placeholder="Repeat password" />
              </div>
            </div>
          )}

          {/* Step 2: Company */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Company Name</label>
                <Input value={formValues.companyName} onChange={e => handleChange('companyName', e.target.value)} placeholder="Acme Pvt Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Company Email</label>
                <Input type="email" value={formValues.companyEmail} onChange={e => handleChange('companyEmail', e.target.value)} placeholder="info@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Company Phone</label>
                <Input type="tel" value={formValues.companyPhone} onChange={e => handleChange('companyPhone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Address</label>
                <Input value={formValues.companyAddress} onChange={e => handleChange('companyAddress', e.target.value)} placeholder="123 Business Street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                  <Input value={formValues.companyCity} onChange={e => handleChange('companyCity', e.target.value)} placeholder="Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">State</label>
                  <Input value={formValues.companyState} onChange={e => handleChange('companyState', e.target.value)} placeholder="Maharashtra" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Postal Code</label>
                  <Input value={formValues.companyPostalCode} onChange={e => handleChange('companyPostalCode', e.target.value)} placeholder="400001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Country</label>
                  <Input value={formValues.companyCountry} onChange={e => handleChange('companyCountry', e.target.value)} placeholder="India" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">GST Number (optional)</label>
                <Input value={formValues.gstNumber} onChange={e => handleChange('gstNumber', e.target.value)} placeholder="22AAAAA0000A1Z5" />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--surface-2)' }}>
                <p className="text-sm font-semibold text-text-primary">{formValues.firstName} {formValues.lastName}</p>
                <p className="text-sm text-text-muted">{formValues.email}</p>
              </div>
              <div className="rounded-lg p-4 space-y-2" style={{ background: 'var(--surface-2)' }}>
                <p className="text-sm font-semibold text-text-primary">{formValues.companyName}</p>
                <p className="text-sm text-text-muted">{formValues.companyEmail} · {formValues.companyPhone}</p>
                <p className="text-sm text-text-muted">{formValues.companyAddress}, {formValues.companyCity}, {formValues.companyState} {formValues.companyPostalCode}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formValues.terms}
                  onChange={e => handleChange('terms', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-primary-500"
                />
                <span className="text-sm text-text-muted">
                  I agree to the <a href="#" className="text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>
          )}

          {/* Error / Success */}
          {stepError && (
            <div className="flex items-center gap-2 text-sm text-error rounded-lg px-3 py-2.5" style={{ background: 'var(--error-bg)' }}>
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {stepError}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-success rounded-lg px-3 py-2.5" style={{ background: 'rgba(var(--success-rgb,34,197,94),0.1)' }}>
              {success}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {activeStep > 1 && (
              <Button variant="outline" onClick={() => { setStepError(''); setActiveStep(p => p - 1); }}>
                Back
              </Button>
            )}
            <Button variant="primary" block onClick={handleSubmit} loading={loading}>
              {activeStep < 3 ? 'Continue' : 'Create Account'}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
