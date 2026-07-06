import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = ({
  children,
  className = '',
  header,
  footer,
}: CardProps) => {
  return (
    <div className={`rounded-xl border border-surface-2 bg-surface-1 shadow-md ${className}`}>
      {header && <div className="px-6 py-4 border-b border-surface-2">{header}</div>}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-surface-2">{footer}</div>}
    </div>
  );
};
