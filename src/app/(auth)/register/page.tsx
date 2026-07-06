'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

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
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (field: keyof FormValues, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    const { firstName, lastName, email, phone, password, confirmPassword } = formValues;
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      alert('Please fill in all personal information fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
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
      alert('Please fill in all company information fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(companyEmail)) {
      alert('Please enter a valid company email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (activeStep === 1) {
      if (validateStep1()) {
        setActiveStep(2);
      }
      return;
    }

    if (activeStep === 2) {
      if (!validateStep2()) {
        return;
      }
    }

    // Final submission (step 3 or step 2 if we go directly)
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Registration successful! Redirecting to login...');
      // In a real app, you'd redirect to login page
      // router.push('/auth/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Personal Information', description: 'Enter your personal details' },
    { title: 'Company Information', description: 'Provide details about your company' },
    { title: 'Account Setup', description: 'Set up your account preferences' }
  ];

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="text-text-muted">Get started with InvoiceGen</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center space-x-4 text-sm text-text-muted">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${activeStep - 1 >= index ? 'bg-primary-500' : activeStep === index ? 'bg-primary-300' : 'bg-surface-2'}`}></div>
              {index < steps.length - 1 && (
                <div className={`flex-1 border-b border-surface-2 ${activeStep - 1 >= index ? 'bg-primary-500' : 'transparent'}`} style={{ height: '2px' }}></div>
              )}
              <span>{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">First Name</label>
                <Input
                  value={formValues.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Last Name</label>
                <Input
                  value={formValues.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
                <Input
                  type="email"
                  value={formValues.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Phone Number</label>
                <Input
                  type="tel"
                  value={formValues.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Password</label>
                <Input
                  type="password"
                  value={formValues.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Confirm Password</label>
                <Input
                  type="password"
                  value={formValues.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Company Name</label>
                <Input
                  value={formValues.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Company Email</label>
                <Input
                  type="email"
                  value={formValues.companyEmail}
                  onChange={(e) => handleChange('companyEmail', e.target.value)}
                  placeholder="Enter company email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Company Phone</label>
                <Input
                  type="tel"
                  value={formValues.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  placeholder="Enter company phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Company Address</label>
                <Input
                  value={formValues.companyAddress}
                  onChange={(e) => handleChange('companyAddress', e.target.value)}
                  placeholder="Enter company address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">City</label>
                  <Input
                    value={formValues.companyCity}
                    onChange={(e) => handleChange('companyCity', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">State/Province</label>
                  <Input
                    value={formValues.companyState}
                    onChange={(e) => handleChange('companyState', e.target.value)}
                    placeholder="Enter state or province"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Postal Code</label>
                  <Input
                    value={formValues.companyPostalCode}
                    onChange={(e) => handleChange('companyPostalCode', e.target.value)}
                    placeholder="Enter postal code"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Country</label>
                  <Input
                    value={formValues.companyCountry}
                    onChange={(e) => handleChange('companyCountry', e.target.value)}
                    placeholder="Enter country"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">GST Number (Optional)</label>
                <Input
                  value={formValues.gstNumber}
                  onChange={(e) => handleChange('gstNumber', e.target.value)}
                  placeholder="Enter GST number (if applicable)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Industry</label>
                  <Input
                    value={formValues.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    placeholder="Enter industry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Employee Count</label>
                  <Input
                    value={formValues.employeeCount}
                    onChange={(e) => handleChange('employeeCount', e.target.value)}
                    placeholder="Enter number of employees"
                  />
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">
                  <input
                    type="checkbox"
                    checked={formValues.terms}
                    onChange={(e) => handleChange('terms', e.target.checked)}
                  />
                  I agree to the Terms of Service and Privacy Policy
                </label>
                <p className="text-xs text-text-muted mt-1">
                  By creating an account, you agree to our Terms of Service and acknowledge our Privacy Policy.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {activeStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            >
              Back
            </Button>
          )}

          {activeStep < steps.length ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {activeStep === steps.length ? 'Create Account' : 'Next'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              Create Account
            </Button>
          )}
        </div>

        <div className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <a href="/auth/login" className="text-primary-500 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}