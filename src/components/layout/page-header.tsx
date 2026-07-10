interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  // kept for backward compat — navbar now handles breadcrumbs
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, description, children, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-text-muted mt-0.5">{description}</p>
        )}
      </div>
      {(children || actions) && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
};
