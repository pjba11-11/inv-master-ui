import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  autoResize?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export const Textarea = ({
  value,
  onChange,
  placeholder = '',
  rows = 4,
  disabled = false,
  error = false,
  className = '',
  autoResize = false,
  onBlur,
}: TextareaProps) => {
  return (
    <textarea
      onBlur={onBlur}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      className={`block w-full rounded-lg px-3.5 py-2.5 text-sm text-text-primary
        placeholder:text-text-muted bg-surface-2 outline-none transition-all duration-150
        focus:ring-1 focus:ring-primary-500/50
        disabled:opacity-40 disabled:cursor-not-allowed
        ${error ? 'ring-1 ring-error/60' : ''}
        ${className}`}
      style={{
        border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
        resize: autoResize ? 'vertical' : 'none',
      }}
    />
  );
};
