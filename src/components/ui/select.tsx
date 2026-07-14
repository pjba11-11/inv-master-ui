import React from 'react';

interface SelectProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
  onBlur,
}: SelectProps) => {
  return (
    <select
      onBlur={onBlur}
      value={String(value)}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full appearance-none rounded-lg pl-3.5 pr-9 py-2.5 text-sm text-text-primary
        bg-surface-2 outline-none transition-all duration-150 cursor-pointer
        focus:ring-1 focus:ring-primary-500/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${error ? 'ring-1 ring-error/60' : ''}
        ${className}`}
      style={{
        border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236B6B88' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '1rem',
      }}
    >
      {placeholder && (
        <option value="" disabled hidden className="bg-surface-2">
          {placeholder}
        </option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-surface-2 text-text-primary">
          {opt.label}
        </option>
      ))}
    </select>
  );
};
