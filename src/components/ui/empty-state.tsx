interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const DefaultIcon = () => (
  <svg className="h-8 w-8 text-text-muted" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
    <div
      className="flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
    >
      {icon ?? <DefaultIcon />}
    </div>
    <div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      {description && <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto">{description}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
