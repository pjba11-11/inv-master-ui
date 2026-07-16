'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormSkeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { useRole } from '@/hooks/use-role';

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

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
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

const ROLES = ['ADMIN', 'MANAGER', 'EMPLOYEE'];

export default function SettingsPage() {
  const { role, canWrite } = useRole();
  const isAdmin = role === 'ADMIN';

  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [vehicleInput, setVehicleInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [users, setUsers] = useState<TeamMember[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [addingUser, setAddingUser] = useState(false);
  const [userError, setUserError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
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

  useEffect(() => {
    if (isAdmin) {
      setUsersLoading(true);
      fetch('/api/admin/users')
        .then(r => r.ok ? r.json() : [])
        .then(data => { setUsers(Array.isArray(data) ? data : []); setUsersLoading(false); })
        .catch(() => setUsersLoading(false));
    }
  }, [isAdmin]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...settings,
      vehicleNumbers: vehicleInput.split(',').map(v => v.trim()).filter(Boolean),
    };
    const res = await fetch('/api/settings', {
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

  const change = (field: keyof Settings, value: Settings[keyof Settings]) =>
    setSettings(prev => ({ ...prev, [field]: value }));

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setAddingUser(true);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (!res.ok) {
      setUserError(data.message ?? data.error ?? 'Failed to create user.');
    } else {
      setUsers(prev => [...prev, data]);
      setNewUser({ name: '', email: '', password: '', role: 'EMPLOYEE' });
      setShowAddForm(false);
    }
    setAddingUser(false);
  };

  const roleBadge: Record<string, string> = {
    ADMIN: 'bg-primary-500/20 text-primary-400',
    MANAGER: 'bg-warning/20 text-warning',
    EMPLOYEE: 'bg-surface-3 text-text-muted',
  };

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
                min="0" max="100" step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">CGST %</label>
              <Input
                type="number"
                value={settings.cgstPercentage}
                onChange={e => change('cgstPercentage', parseFloat(e.target.value) || 0)}
                min="0" max="100" step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">SGST %</label>
              <Input
                type="number"
                value={settings.sgstPercentage}
                onChange={e => change('sgstPercentage', parseFloat(e.target.value) || 0)}
                min="0" max="100" step="0.01"
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
              <Input value={settings.invoicePrefix} onChange={e => change('invoicePrefix', e.target.value)} placeholder="INV" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Financial Year</label>
              <Input value={settings.financialYear} onChange={e => change('financialYear', e.target.value)} placeholder="2024-25" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Currency</label>
              <Input value={settings.currency} onChange={e => change('currency', e.target.value)} placeholder="INR" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Default Profit Margin (%)</label>
              <Input
                type="number"
                value={settings.defaultProfitMargin}
                onChange={e => change('defaultProfitMargin', parseFloat(e.target.value) || 0)}
                min="0" step="0.01"
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
                <span key={i} className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500">{v}</span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {canWrite && (
        <div className="flex items-center justify-end gap-4">
          {saved && <p className="text-sm text-success">Settings saved successfully.</p>}
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save Settings
          </Button>
        </div>
      )}

      {/* Team Members — admin only */}
      {isAdmin && (
        <Card>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-surface-2 pb-3">
              <h2 className="text-lg font-semibold text-text-primary">Team Members</h2>
              <Button variant="primary" size="sm" onClick={() => setShowAddForm(v => !v)}>
                {showAddForm ? 'Cancel' : '+ Add User'}
              </Button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddUser} className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 p-4 rounded-xl border border-surface-2 bg-surface-0">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Full Name</label>
                  <Input
                    required
                    placeholder="Jane Smith"
                    value={newUser.name}
                    onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Email</label>
                  <Input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={newUser.email}
                    onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Password</label>
                  <Input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={newUser.password}
                    onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser(u => ({ ...u, role: e.target.value }))}
                    className="w-full rounded-lg border border-surface-3 bg-surface-1 px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {userError && (
                  <p className="md:col-span-2 lg:col-span-4 text-sm text-error">{userError}</p>
                )}
                <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                  <Button variant="primary" type="submit" loading={addingUser} size="sm">
                    Create User
                  </Button>
                </div>
              </form>
            )}

            {usersLoading ? (
              <p className="text-sm text-text-muted">Loading users…</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-text-muted">No team members found.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-2">
                    <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Name</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Email</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Role</th>
                    <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-2">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-1">
                      <td className="px-4 py-3 text-sm text-text-primary font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-text-muted">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] ?? 'bg-surface-3 text-text-muted'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
