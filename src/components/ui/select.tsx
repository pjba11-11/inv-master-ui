import React from 'react';

interface SelectProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  className = '',
}: SelectProps) => {
  const baseClasses = `
    block w-full rounded-md border border-neutral-300 bg-surface-2 
    px-4 py-2 text-text-primary placeholder:text-text-muted 
    focus-visible:ring-2 focus-visible:ring-primary-400 
    focus-visible:border-transparent disabled:opacity-50 
    disabled:cursor-not-allowed transition-all duration-200
  `;

  const errorClasses = error
    ? 'border-error bg-error/10 focus-visible:ring-error/20'
    : '';

  return (
    <select
      value={String(value)}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${className}`}
    >
      {placeholder && (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
