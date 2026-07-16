'use client';

import { useState, useEffect } from 'react';
import { useForm, FormErrors } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CatalogMaterial {
  id: number;
  materialName: string;
  unit: string;
  currentPrice: number;
}

export interface ProductFormValues {
  productName: string;
  description: string;
  hsnCode: string;
  labourCharges: number;
  profitMargin: number;
  active: boolean;
}

export interface ProductFormPayload extends ProductFormValues {
  materialIds: number[];
}

export const ProductForm = ({
  onSubmit,
  initialData,
  initialMaterialIds = [],
  isEditMode = false,
}: {
  onSubmit: (data: ProductFormPayload) => Promise<void> | void;
  initialData?: Partial<ProductFormValues>;
  initialMaterialIds?: number[];
  isEditMode?: boolean;
}) => {
  const [catalog, setCatalog] = useState<CatalogMaterial[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(initialMaterialIds));

  const defaultValues: ProductFormValues = {
    productName: '',
    description: '',
    hsnCode: '',
    labourCharges: 0,
    profitMargin: 0,
    active: true,
    ...initialData,
  };

  const validate = (values: ProductFormValues) => {
    const errors: Partial<Record<keyof ProductFormValues, string>> = {};
    if (!values.productName.trim()) errors.productName = 'Product name is required';
    if (values.labourCharges < 0) errors.labourCharges = 'Must be ≥ 0';
    if (values.profitMargin < 0) errors.profitMargin = 'Must be ≥ 0';
    return errors as FormErrors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } =
    useForm<ProductFormValues>({
      initialValues: defaultValues,
      validate,
      onSubmit: (data) => {
        if (selectedIds.size === 0) return Promise.reject('Select at least one material');
        return onSubmit({ ...data, materialIds: Array.from(selectedIds) });
      },
    });

  useEffect(() => {
    fetch('/api/materials')
      .then(r => r.ok ? r.json() : [])
      .then((data: (CatalogMaterial & { active?: boolean })[]) =>
        setCatalog(Array.isArray(data) ? data.filter(m => m.active !== false) : []))
      .catch(() => {});
    if (!isEditMode) {
      fetch('/api/settings')
        .then(r => r.ok ? r.json() : null)
        .then((s: { defaultProfitMargin?: number } | null) => {
          if (s?.defaultProfitMargin != null) {
            handleChange('profitMargin', Number(s.defaultProfitMargin));
          }
        })
        .catch(() => {});
    }
  }, []);

  const toggleMaterial = (id: number) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectedMaterials = catalog.filter(m => selectedIds.has(m.id));
  const materialTotal = selectedMaterials.reduce((sum, m) => sum + (Number(m.currentPrice) || 0), 0);
  const manufacturingCost = materialTotal + (Number(values.labourCharges) || 0);
  const sellingPrice = manufacturingCost * (1 + (Number(values.profitMargin) || 0) / 100);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Basic info ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Product Name *</label>
          <Input
            value={values.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
            onBlur={() => handleBlur('productName')}
            placeholder="Enter product name"
          />
          {errors.productName && <p className="mt-1 text-sm text-error">{errors.productName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">HSN Code</label>
          <Input
            value={values.hsnCode}
            onChange={(e) => handleChange('hsnCode', e.target.value)}
            placeholder="e.g. 7208"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
          <Textarea
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter product description"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Active</label>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={values.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="h-4 w-4 rounded"
            />
            <span className="ml-2 text-text-muted">Product is active</span>
          </div>
        </div>
      </div>

      {/* ── Material selection ── */}
      <div className="border-t border-surface-2 pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Materials *</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {selectedIds.size === 0
                ? 'Select materials from your catalog below'
                : `${selectedIds.size} selected · ₹${materialTotal.toFixed(2)} total`}
            </p>
          </div>
        </div>

        {catalog.length === 0 ? (
          <div className="rounded-lg border border-surface-2 bg-surface-1 p-6 text-center">
            <p className="text-sm text-text-muted">No materials in catalog yet.</p>
            <a href="/dashboard/materials/add" className="mt-2 inline-block text-xs text-primary-500 hover:underline">
              Add materials →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {catalog.map(m => {
              const checked = selectedIds.has(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMaterial(m.id)}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                    checked
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-surface-3 bg-surface-1 hover:border-surface-4'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{m.materialName}</p>
                    <p className="text-xs text-text-muted">{m.unit ?? '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">₹{Number(m.currentPrice).toFixed(2)}</p>
                    {checked && <p className="text-xs text-primary-500">✓ selected</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pricing ── */}
      <div className="border-t border-surface-2 pt-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Pricing</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Labour Charges (₹)</label>
            <Input
              type="number"
              value={values.labourCharges.toString()}
              onChange={(e) => handleChange('labourCharges', parseFloat(e.target.value) || 0)}
              onBlur={() => handleBlur('labourCharges')}
              placeholder="0.00"
            />
            {errors.labourCharges && <p className="mt-1 text-sm text-error">{errors.labourCharges}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Profit Margin (%)</label>
            <Input
              type="number"
              value={values.profitMargin.toString()}
              onChange={(e) => handleChange('profitMargin', parseFloat(e.target.value) || 0)}
              onBlur={() => handleBlur('profitMargin')}
              placeholder="0.0"
            />
            {errors.profitMargin && <p className="mt-1 text-sm text-error">{errors.profitMargin}</p>}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg bg-surface-1 border border-surface-2 p-4">
          <div>
            <p className="text-xs text-text-muted mb-1">Material Total</p>
            <p className="text-base font-semibold text-text-primary">₹{materialTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Manufacturing Cost</p>
            <p className="text-base font-semibold text-text-primary">₹{manufacturingCost.toFixed(2)}</p>
            <p className="text-xs text-text-muted">materials + labour</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Selling Price</p>
            <p className="text-lg font-bold text-primary-500">₹{sellingPrice.toFixed(2)}</p>
            <p className="text-xs text-text-muted">at {values.profitMargin}% margin</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {!isEditMode && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => { resetForm(); setSelectedIds(new Set()); }}
          >
            Cancel
          </Button>
        )}
        <Button variant="primary" type="submit" disabled={isSubmitting || selectedIds.size === 0}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
