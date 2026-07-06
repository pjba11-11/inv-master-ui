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
}: TextareaProps) => {
  const baseClasses = `
    block w-full min-h-[#{rows * 2.5}rem] resize-none rounded-md border border-neutral-300 bg-surface-2 
    px-4 py-2 text-text-primary placeholder:text-text-muted 
    focus-visible:ring-2 focus-visible:ring-primary-400 
    focus-visible:border-transparent disabled:opacity-50 
    disabled:cursor-not-allowed transition-all duration-200
  `;

  const errorClasses = error
    ? 'border-error bg-error/10 focus-visible:ring-error/20'
    : '';

  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      className={`${baseClasses} ${errorClasses} ${className}`}
      style={{ resize: autoResize ? 'vertical' : 'none' }}
    />
  );
};
