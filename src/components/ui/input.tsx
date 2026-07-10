import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  minLength?: number;
  maxLength?: number;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  min,
  max,
  step,
  minLength,
  maxLength,
  className = '',
  autoComplete = 'off',
  autoFocus,
  name,
  id,
  onBlur,
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
      minLength={minLength}
      maxLength={maxLength}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      name={name}
      id={id}
      onBlur={onBlur}
      className={`block w-full rounded-lg px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted
        bg-surface-2 transition-all duration-150 outline-none
        focus:ring-1 focus:ring-primary-500/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${error ? 'ring-1 ring-error/60' : ''}
        ${className}`}
      style={{
        border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
      }}
    />
  );
};
