import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ label: string; href: string }>;
  children?: React.ReactNode;
}

export const PageHeader = ({
  title,
  description,
  actions,
  showBreadcrumbs = true,
  breadcrumbItems = [],
  children
}: PageHeaderProps) => {
  return (
    <div className="border-b border-surface-2 pb-4 mb-6">
      {showBreadcrumbs && (
        <Breadcrumbs items={breadcrumbItems} />
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          {description && (
            <p className="text-text-muted">{description}</p>
          )}
        </div>

        {actions && (
          <div className="mt-4 md:mt-0 space-x-3">
            {actions}
          </div>
        )}
      </div>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};
