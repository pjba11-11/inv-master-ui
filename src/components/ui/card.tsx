import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = ({ children, className = '', header, footer }: CardProps) => {
  return (
    <div
      className={`rounded-xl bg-surface-1 ${className}`}
      style={{
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      }}
    >
      {header && (
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          {header}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {footer}
        </div>
      )}
    </div>
  );
};
