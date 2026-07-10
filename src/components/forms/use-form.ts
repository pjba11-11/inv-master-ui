import { useState, useCallback } from 'react';

interface FormValues {
  [key: string]: any;
}

export interface FormErrors {
  [key: string]: string;
}

interface FormOptions<T extends FormValues> {
  initialValues: T;
  validate?: (values: T) => FormErrors;
  onSubmit?: (values: T) => Promise<void> | void;
}

export const useForm = <T extends FormValues>({ 
  initialValues, 
  validate,
  onSubmit 
}: FormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof T) => {
    if (validate) {
      const fieldErrors = validate(values);
      if (fieldErrors[field as string]) {
        setErrors(prev => ({
          ...prev,
          [field as string]: fieldErrors[field as string]
        }));
      }
    }
  }, [validate, values]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    handleChange(field, value);
  }, [handleChange]);

  const setFieldsValue = useCallback((values: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...values
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitted(false);
  }, [initialValues]);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const formErrors = validate(values);
    setErrors(formErrors);
    
    return Object.keys(formErrors).length === 0;
  }, [validate, values]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit?.(values);
      setIsSubmitted(true);
    } catch (error) {
      // Handle submission error
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  return {
    values,
    errors,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldsValue,
    resetForm,
    validateForm,
    handleSubmit
  };
};
