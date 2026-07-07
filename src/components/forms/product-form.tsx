import { useState } from 'react';
import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Matches CreateProductRequest — products are priced via manufacturingCost / sellingPrice,
// not a flat unitPrice. Materials are required (product_materials join table on the backend).
interface MaterialEntry {
  id?: number;
  materialName: string;
  unit: string;
  currentPrice: number;
}

interface ProductFormValues {
  productName: string;
  description: string;
  manufacturingCost: number;
  sellingPrice: number;
  active: boolean;
}

export const ProductForm = ({
  onSubmit,
  initialData,
  initialMaterials = [],
  isEditMode = false,
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<ProductFormValues>;
  initialMaterials?: MaterialEntry[];
  isEditMode?: boolean;
}) => {
  const [materials, setMaterials] = useState<MaterialEntry[]>(
    initialMaterials.length > 0 ? initialMaterials : [{ materialName: '', unit: '', currentPrice: 0 }]
  );

  const defaultValues: ProductFormValues = {
    productName: '',
    description: '',
    manufacturingCost: 0,
    sellingPrice: 0,
    active: true,
    ...initialData,
  };

  const validate = (values: ProductFormValues) => {
    const errors: Partial<Record<keyof ProductFormValues, string>> = {};
    if (!values.productName.trim()) errors.productName = 'Product name is required';
    if (values.sellingPrice < 0) errors.sellingPrice = 'Selling price must be ≥ 0';
    return errors as FormErrors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } =
    useForm<ProductFormValues>({ initialValues: defaultValues, validate, onSubmit: (data) => onSubmit({ ...data, materials }) });

  const addMaterial = () =>
    setMaterials(prev => [...prev, { materialName: '', unit: '', currentPrice: 0 }]);

  const removeMaterial = (index: number) =>
    setMaterials(prev => prev.filter((_, i) => i !== index));

  const updateMaterial = (index: number, field: keyof MaterialEntry, value: string | number) =>
    setMaterials(prev => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));

  const profitMargin = values.manufacturingCost > 0
    ? (((values.sellingPrice - values.manufacturingCost) / values.manufacturingCost) * 100).toFixed(1)
    : '0.0';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="block text-sm font-medium text-text-muted mb-1">Active</label>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={values.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="h-4 w-4 text-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-text-muted">Product is active</span>
          </div>
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
          <label className="block text-sm font-medium text-text-muted mb-1">Manufacturing Cost</label>
          <Input
            type="number"
            value={values.manufacturingCost.toString()}
            onChange={(e) => handleChange('manufacturingCost', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Selling Price</label>
          <Input
            type="number"
            value={values.sellingPrice.toString()}
            onChange={(e) => handleChange('sellingPrice', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
          {errors.sellingPrice && <p className="mt-1 text-sm text-error">{errors.sellingPrice}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Profit Margin</label>
          <p className="text-lg font-semibold text-primary-500">{profitMargin}%</p>
        </div>
      </div>

      <div className="border-t border-surface-2 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Materials *</h2>
          <Button variant="secondary" onClick={addMaterial} type="button">+ Add Material</Button>
        </div>

        {materials.map((mat, idx) => (
          <div key={idx} className="grid grid-cols-1 gap-3 md:grid-cols-4 mb-3 items-end">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Material Name</label>
              <Input
                value={mat.materialName}
                onChange={(e) => updateMaterial(idx, 'materialName', e.target.value)}
                placeholder="e.g. Steel Rod"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Unit</label>
              <Input
                value={mat.unit}
                onChange={(e) => updateMaterial(idx, 'unit', e.target.value)}
                placeholder="e.g. kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Price per Unit</label>
              <Input
                type="number"
                value={mat.currentPrice.toString()}
                onChange={(e) => updateMaterial(idx, 'currentPrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
            <div>
              {materials.length > 1 && (
                <Button variant="secondary" onClick={() => removeMaterial(idx)} type="button">Remove</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {!isEditMode && (
          <Button variant="secondary" onClick={() => { resetForm(); setMaterials([{ materialName: '', unit: '', currentPrice: 0 }]); }}>
            Cancel
          </Button>
        )}
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
