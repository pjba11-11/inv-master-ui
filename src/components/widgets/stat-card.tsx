import { Button } from '@/components/ui/button';

interface TrendProps {
  value: string;
  isPositive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: TrendProps;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export const StatCard = ({
  title,
  value,
  trend,
  icon,
  color = 'primary'
}: StatCardProps) => {
  // Color mapping
  const colorMap: Record<string, string> = {
    primary: 'primary-500',
    secondary: 'neutral-500',
    success: 'success',
    warning: 'warning',
    info: 'info'
  };

  const bgColorMap: Record<string, string> = {
    primary: 'primary-50',
    secondary: 'neutral-50',
    success: 'success/10',
    warning: 'warning/10',
    info: 'info/10'
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'primary': return 'primary-500';
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'text-text-primary';
    }
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'success': return 'bg-gradient-stat-success';
      case 'warning': return 'bg-gradient-stat-warning';
      case 'info': return 'bg-gradient-stat-info';
      default: return 'bg-gradient-stat-primary';
    }
  };

  const getAccentColor = (color: string) => {
    switch (color) {
      case 'success': return 'from-success/10 to-transparent';
      case 'warning': return 'from-warning/10 to-transparent';
      case 'info': return 'from-info/10 to-transparent';
      default: return 'from-primary-400/8 to-transparent';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border border-surface-2 p-6 flex flex-col h-32 shadow-lg ${getGradientClass(color)} transition-all hover:shadow-2xl hover:border-primary-400/60`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getAccentColor(color)} pointer-events-none rounded-xl`}></div>
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className={`h-8 w-8 flex items-center justify-center rounded-md bg-${bgColorMap[color]}`}>
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-text-muted">{title}</h3>
        </div>
        {trend && (
          <span className={`text-xs font-medium 
            ${trend.isPositive ? 'text-success' : 'text-error'}
          `}>
            {trend.value}
          </span>
        )}
      </div>

      <div className="relative z-10 text-2xl font-bold text-text-primary flex-1">
        {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
      </div>
    </div>
  );
};
