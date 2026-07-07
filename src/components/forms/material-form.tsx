import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Fields match MaterialDTO — no description or supplier in the backend schema.
interface MaterialFormValues {
  materialName: string;
  unit: string;
  currentPrice: number;
  active: boolean;
}

export const MaterialForm = ({
  onSubmit,
  initialData,
  isEditMode = false,
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<MaterialFormValues>;
  isEditMode?: boolean;
}) => {
  const defaultValues: MaterialFormValues = {
    materialName: '',
    unit: '',
    currentPrice: 0,
    active: true,
    ...initialData,
  };

  const validate = (values: MaterialFormValues) => {
    const errors: Partial<Record<keyof MaterialFormValues, string>> = {};
    if (!values.materialName.trim()) errors.materialName = 'Material name is required';
    if (!values.unit.trim()) errors.unit = 'Unit is required';
    if (values.currentPrice < 0) errors.currentPrice = 'Price must be ≥ 0';
    return errors as FormErrors;
  };

  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm } =
    useForm<MaterialFormValues>({ initialValues: defaultValues, validate, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Material Name *</label>
          <Input
            value={values.materialName}
            onChange={(e) => handleChange('materialName', e.target.value)}
            onBlur={() => handleBlur('materialName')}
            placeholder="Enter material name"
          />
          {errors.materialName && <p className="mt-1 text-sm text-error">{errors.materialName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Unit *</label>
          <Input
            value={values.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            onBlur={() => handleBlur('unit')}
            placeholder="e.g. kg, m, pcs"
          />
          {errors.unit && <p className="mt-1 text-sm text-error">{errors.unit}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Current Price</label>
          <Input
            type="number"
            value={values.currentPrice.toString()}
            onChange={(e) => handleChange('currentPrice', parseFloat(e.target.value) || 0)}
            onBlur={() => handleBlur('currentPrice')}
            placeholder="0.00"
          />
          {errors.currentPrice && <p className="mt-1 text-sm text-error">{errors.currentPrice}</p>}
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
            <span className="ml-2 text-text-muted">Material is active</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {!isEditMode && (
          <Button variant="secondary" onClick={() => resetForm()}>Cancel</Button>
        )}
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Material' : 'Create Material'}
        </Button>
      </div>
    </form>
  );
};
