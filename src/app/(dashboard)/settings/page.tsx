'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  });

  const [accountForm, setAccountForm] = useState({
    companyName: 'Acme Corporation',
    taxId: 'TXID-123456',
    address: '123 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
  });

  const [appearanceForm, setAppearanceForm] = useState({
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccountForm({ ...accountForm, [name]: value });
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setAppearanceForm({
        ...appearanceForm,
        notifications: {
          ...appearanceForm.notifications,
          [name]: checked,
        },
      });
    } else {
      setAppearanceForm({ ...appearanceForm, [name]: value });
    }
  };

  const handleSaveProfile = () => {
    alert('Profile saved!');
  };

  const handleSaveAccount = () => {
    alert('Account details saved!');
  };

  const handleSaveAppearance = () => {
    alert('Appearance settings saved!');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/dashboard/settings' }
        ]}
      >
        {/* No actions in header for settings */}
      </PageHeader>

      {/* Profile Section */}
      <Card className="border-surface-2">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Profile</h2>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">First Name</label>
              <Input
                type="text"
                name="firstName"
                value={profileForm.firstName}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Last Name</label>
              <Input
                type="text"
                name="lastName"
                value={profileForm.lastName}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Email</label>
              <Input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
              />
            </div>
          </form>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Section */}
      <Card className="border-surface-2">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Account</h2>
          <form className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Company Name</label>
              <Input
                type="text"
                name="companyName"
                value={accountForm.companyName}
                onChange={handleAccountChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Tax ID</label>
              <Input
                type="text"
                name="taxId"
                value={accountForm.taxId}
                onChange={handleAccountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Address</label>
              <Input
                type="text"
                name="address"
                value={accountForm.address}
                onChange={handleAccountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">City</label>
              <Input
                type="text"
                name="city"
                value={accountForm.city}
                onChange={handleAccountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">State/Province</label>
              <Input
                type="text"
                name="state"
                value={accountForm.state}
                onChange={handleAccountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">ZIP/Postal Code</label>
              <Input
                type="text"
                name="zipCode"
                value={accountForm.zipCode}
                onChange={handleAccountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Country</label>
              <Select
                value={accountForm.country}
                onChange={handleAccountChange}
                options={[
                  { value: 'USA', label: 'United States' },
                  { value: 'CAN', label: 'Canada' },
                  { value: 'UK', label: 'United Kingdom' },
                  { value: 'AUS', label: 'Australia' },
                  { value: 'DEU', label: 'Germany' },
                  { value: 'FRA', label: 'France' },
                ]}
                placeholder="Select country"
              />
            </div>
          </form>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={handleSaveAccount}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Appearance Section */}
      <Card className="border-surface-2">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Appearance</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Theme</label>
              <Select
                value={appearanceForm.theme}
                onChange={handleAppearanceChange}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'system', label: 'System' },
                ]}
                placeholder="Select theme"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Language</label>
              <Select
                value={appearanceForm.language}
                onChange={handleAppearanceChange}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                ]}
                placeholder="Select language"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-text-muted">Date Format</label>
              <Select
                value={appearanceForm.dateFormat}
                onChange={handleAppearanceChange}
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
                placeholder="Select date format"
              />
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium mb-2 text-text-primary">Notifications</p>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={appearanceForm.notifications.email}
                    onChange={(e) => handleAppearanceChange({ target: { name: 'email', type: 'checkbox', checked: e.target.checked } } as React.ChangeEvent<HTMLInputElement>)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-5 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-text-muted">Email notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={appearanceForm.notifications.push}
                    onChange={(e) => handleAppearanceChange({ target: { name: 'push', type: 'checkbox', checked: e.target.checked } } as React.ChangeEvent<HTMLInputElement>)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-5 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-text-muted">Push notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={appearanceForm.notifications.sms}
                    onChange={(e) => handleAppearanceChange({ target: { name: 'sms', type: 'checkbox', checked: e.target.checked } } as React.ChangeEvent<HTMLInputElement>)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-5 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-text-muted">SMS notifications</span>
                </label>
              </div>
            </div>
          </form>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={handleSaveAppearance}>
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}