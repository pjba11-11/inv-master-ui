import { useForm } from './use-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ProductFormValues {
  name: string;
  description: string;
  sku: string;
  category: string;
  unitPrice: number;
  taxable: boolean;
  isActive: boolean;
}

export const ProductForm = ({ 
  onSubmit, 
  initialData,
  isEditMode = false
}: {
  onSubmit: (data: any) => Promise<void> | void;
  initialData?: Partial<ProductFormValues>;
  isEditMode?: boolean;
}) => {
  const defaultValues: ProductFormValues = {
    name: '',
    description: '',
    sku: '',
    category: '',
    unitPrice: 0,
    taxable: true,
    isActive: true,
    ...initialData
  };

  const validate = (values: ProductFormValues) => {
    const errors: Partial<Record<keyof ProductFormValues, string>> = {};
    
    if (!values.name.trim()) {
      errors.name = 'Product name is required';
    }

    if (!values.sku.trim()) {
      errors.sku = 'SKU is required';
    }

    if (values.unitPrice < 0) {
      errors.unitPrice = 'Unit price must be greater than or equal to zero';
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
  } = useForm<ProductFormValues>({
    initialValues: defaultValues,
    validate,
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Product Name</label>
          <Input
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Enter product name"
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
            placeholder="Enter product description"
            rows={3}
            className={errors.description ? '' : ''}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">SKU</label>
          <Input
            value={values.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            onBlur={() => handleBlur('sku')}
            placeholder="Enter SKU (Stock Keeping Unit)"
            className={errors.sku ? '' : ''}
          />
          {errors.sku && (
            <p className="mt-1 text-sm text-error">{errors.sku}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Category</label>
          <Input
            value={values.category}
            onChange={(e) => handleChange('category', e.target.value)}
            onBlur={() => handleBlur('category')}
            placeholder="Enter product category"
            className={errors.category ? '' : ''}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-error">{errors.category}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Unit Price</label>
          <div className="flex items-center">
            <span className="mr-2">$</span>
            <Input
              type="number"
              value={values.unitPrice.toString()}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                handleChange('unitPrice', value);
              }}
              onBlur={() => handleBlur('unitPrice')}
              placeholder="0.00"
              className={errors.unitPrice ? '' : ''}
            />
          </div>
          {errors.unitPrice && (
            <p className="mt-1 text-sm text-error">{errors.unitPrice}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Taxable</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={values.taxable}
              onChange={(e) => handleChange('taxable', e.target.checked)}
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-text-muted">Charge tax on this product</span>
          </div>
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
            <span className="ml-2 text-text-muted">Active product</span>
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
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
