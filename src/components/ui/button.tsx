import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  type?: 'submit' | 'button' | 'reset';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  className = '',
}: ButtonProps) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 rounded-md font-medium
    transition-all duration-200 ease-in-out focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none
    disabled:opacity-50 disabled:cursor-not-allowed hover:no-disabled:[&_*]:pointer-events-none
  `;

  const variantClasses = {
    primary: `
      bg-primary-500 hover:bg-primary-400 active:bg-primary-600
      text-white focus-visible:ring-primary-300
    `,
    secondary: `
      bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800
      text-white focus-visible:ring-neutral-600
    `,
    ghost: `
      bg-transparent hover:bg-surface-3 active:bg-surface-2
      text-primary-400 hover:text-primary-300 focus-visible:ring-primary-300/50
    `,
    destructive: `
      bg-error hover:bg-error/90 active:bg-error/80
      text-white focus-visible:ring-error/30
    `,
    outline: `
      border border-neutral-300
      text-primary-500 bg-transparent
      hover:border-primary-500 hover:bg-primary-50 hover:text-primary-500
    `,
  }[variant];

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }[size];

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${block ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};