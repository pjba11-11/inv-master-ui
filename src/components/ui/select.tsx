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
      className={`block w-full rounded-lg px-3.5 py-2.5 text-sm text-text-primary
        bg-surface-2 outline-none transition-all duration-150
        focus:ring-1 focus:ring-primary-500/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${error ? 'ring-1 ring-error/60' : ''}
        ${className}`}
      style={{
        border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
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
