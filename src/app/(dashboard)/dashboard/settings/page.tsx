'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSkeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';

interface Settings {
  id?: number;
  gstPercentage: number;
  cgstPercentage: number;
  sgstPercentage: number;
  vehicleNumbers: string[];
  defaultProfitMargin: number;
  currency: string;
  invoicePrefix: string;
  financialYear: string;
}

const defaultSettings: Settings = {
  gstPercentage: 18,
  cgstPercentage: 9,
  sgstPercentage: 9,
  vehicleNumbers: [],
  defaultProfitMargin: 20,
  currency: 'INR',
  invoicePrefix: 'INV',
  financialYear: '2024-25',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [vehicleInput, setVehicleInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/companies/1/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setVehicleInput((settings.vehicleNumbers ?? []).join(', '));
  }, [loading]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...settings,
      vehicleNumbers: vehicleInput.split(',').map(v => v.trim()).filter(Boolean),
    };
    const res = await fetch('/api/companies/1/settings', {
      method: settings.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const change = (field: keyof Settings, value: any) =>
    setSettings(prev => ({ ...prev, [field]: value }));

  if (loading) return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your company tax and invoice settings" />
      <FormSkeleton fields={3} />
      <FormSkeleton fields={4} />
      <FormSkeleton fields={1} />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your company tax and invoice settings"
        showBreadcrumbs={true}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/dashboard/settings' },
        ]}
      />

      {/* Tax Settings */}
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary border-b border-surface-2 pb-3">Tax Configuration</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">GST % (total)</label>
              <Input
                type="number"
                value={settings.gstPercentage}
                onChange={e => change('gstPercentage', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">CGST %</label>
              <Input
                type="number"
                value={settings.cgstPercentage}
                onChange={e => change('cgstPercentage', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">SGST %</label>
              <Input
                type="number"
                value={settings.sgstPercentage}
                onChange={e => change('sgstPercentage', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary border-b border-surface-2 pb-3">Invoice Settings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Invoice Prefix</label>
              <Input
                value={settings.invoicePrefix}
                onChange={e => change('invoicePrefix', e.target.value)}
                placeholder="INV"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Financial Year</label>
              <Input
                value={settings.financialYear}
                onChange={e => change('financialYear', e.target.value)}
                placeholder="2024-25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Currency</label>
              <Input
                value={settings.currency}
                onChange={e => change('currency', e.target.value)}
                placeholder="INR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Default Profit Margin (%)</label>
              <Input
                type="number"
                value={settings.defaultProfitMargin}
                onChange={e => change('defaultProfitMargin', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Vehicle Numbers */}
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-text-primary border-b border-surface-2 pb-3">Vehicle Numbers</h2>
          <p className="text-sm text-text-muted">Enter vehicle numbers separated by commas — these appear on invoices.</p>
          <Input
            value={vehicleInput}
            onChange={e => setVehicleInput(e.target.value)}
            placeholder="MH12AB1234, GJ01CD5678"
          />
          {vehicleInput && (
            <div className="flex flex-wrap gap-2 mt-2">
              {vehicleInput.split(',').map(v => v.trim()).filter(Boolean).map((v, i) => (
                <span key={i} className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500">
                  {v}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center justify-end gap-4">
        {saved && <p className="text-sm text-success">Settings saved successfully.</p>}
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
