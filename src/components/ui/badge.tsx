import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({
  variant = 'default',
  className = '',
  children,
}: BadgeProps) => {
  const baseClasses = `
    inline-flex items-center px-3 py-1 text-xs font-medium rounded-full 
    border border-transparent
  `;

  const variantClasses = {
    default: 'bg-primary-100 text-primary-500',
    secondary: 'bg-neutral-100 text-neutral-500',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
