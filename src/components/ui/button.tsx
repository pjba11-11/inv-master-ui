import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'submit' | 'button' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  children,
  className = '',
}: ButtonProps) => {
  const base = `inline-flex items-center justify-center gap-2 rounded-lg font-medium
    transition-all duration-150 ease-in-out focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-0
    disabled:pointer-events-none disabled:opacity-40`;

  const variants = {
    primary: `bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-surface-0
      focus-visible:ring-primary-400 shadow-sm hover:shadow-glow`,
    secondary: `bg-surface-3 hover:bg-surface-4 active:bg-surface-2 text-text-primary
      border focus-visible:ring-surface-4`,
    ghost: `bg-transparent hover:bg-surface-2 active:bg-surface-3
      text-text-muted hover:text-text-primary focus-visible:ring-surface-3`,
    destructive: `bg-error hover:bg-error/90 active:bg-error/80 text-white
      focus-visible:ring-error/50`,
    outline: `border text-text-primary hover:bg-surface-2 active:bg-surface-3
      focus-visible:ring-surface-3`,
  }[variant];

  const borderColor = variant === 'secondary' || variant === 'outline'
    ? { borderColor: 'rgba(255,255,255,0.18)' }
    : {};

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-9 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
  }[size];

  return (
    <button
      type={type}
      style={borderColor}
      className={`${base} ${variants} ${sizes} ${block ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
