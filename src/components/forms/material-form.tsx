import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface MaterialFormValues {
  name: string;
  description: string;
  unit: string;
  currentPrice: number;
  supplier: string;
  isActive: boolean;
}

export const MaterialForm = ({ 
  onSubmit, 
  initialData,
  isEditMode = false
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<MaterialFormValues>;
  isEditMode?: boolean;
}) => {
  const defaultValues: MaterialFormValues = {
    name: '',
    description: '',
    unit: '',
    currentPrice: 0,
    supplier: '',
    isActive: true,
    ...initialData
  };

  const validate = (values: MaterialFormValues) => {
    const errors: Partial<Record<keyof MaterialFormValues, string>> = {};
    
    if (!values.name.trim()) {
      errors.name = 'Material name is required';
    }

    if (!values.unit.trim()) {
      errors.unit = 'Unit is required';
    }

    if (values.currentPrice < 0) {
      errors.currentPrice = 'Current price must be greater than or equal to zero';
    }
    
    return errors as FormErrors;
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm
  } = useForm<MaterialFormValues>({
    initialValues: defaultValues,
    validate,
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Material Name</label>
          <Input
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Enter material name"
            className={errors.name ? '' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-error">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
          <Textarea
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Enter material description"
            rows={3}
            className={errors.description ? '' : ''}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Unit</label>
          <Input
            value={values.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            onBlur={() => handleBlur('unit')}
            placeholder="Enter unit (e.g., kg, pcs, liters)"
            className={errors.unit ? '' : ''}
          />
          {errors.unit && (
            <p className="mt-1 text-sm text-error">{errors.unit}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Current Price</label>
          <div className="flex items-center">
            <span className="mr-2">$</span>
            <Input
              type="number"
              value={values.currentPrice.toString()}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                handleChange('currentPrice', value);
              }}
              onBlur={() => handleBlur('currentPrice')}
              placeholder="0.00"
              className={errors.currentPrice ? '' : ''}
            />
          </div>
          {errors.currentPrice && (
            <p className="mt-1 text-sm text-error">{errors.currentPrice}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Supplier</label>
          <Input
            value={values.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            onBlur={() => handleBlur('supplier')}
            placeholder="Enter supplier name (optional)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Is Active</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-text-muted">Active material</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        {!isEditMode && (
          <Button 
            variant="secondary" 
            onClick={() => resetForm()}
          >
            Cancel
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Material' : 'Create Material'}
        </Button>
      </div>
    </form>
  );
};
