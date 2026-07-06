import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  className?: string;
  autoComplete?: string;
}

export const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  minLength,
  maxLength,
  className = '',
  autoComplete = 'off',
}: InputProps) => {
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
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      className={`${baseClasses} ${errorClasses} ${className}`}
      autoComplete={autoComplete}
    />
  );
};
