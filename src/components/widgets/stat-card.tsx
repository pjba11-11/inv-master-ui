import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: string; isPositive: boolean };
  color?: 'primary' | 'success' | 'warning' | 'info';
  href?: string;
}

const accentMap = {
  primary: { ring: 'rgba(230,155,29,0.12)', glow: 'rgba(230,155,29,0.06)' },
  success:  { ring: 'rgba(34,197,94,0.12)',  glow: 'rgba(34,197,94,0.06)' },
  warning:  { ring: 'rgba(245,158,11,0.12)', glow: 'rgba(245,158,11,0.06)' },
  info:     { ring: 'rgba(59,130,246,0.12)', glow: 'rgba(59,130,246,0.06)' },
};

const dotMap = {
  primary: 'bg-primary-500',
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
};

export const StatCard = ({ title, value, trend, color = 'primary', href }: StatCardProps) => {
  const accent = accentMap[color];

  const card = (
    <div
      className={`relative overflow-hidden rounded-xl p-5 flex flex-col gap-3 transition-all duration-200 hover:translate-y-[-1px] ${href ? 'cursor-pointer' : ''}`}
      style={{
        background: 'var(--surface-1)',
        border: `1px solid ${accent.ring}`,
        boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 0 40px ${accent.glow}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dotMap[color]}`} />
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{title}</span>
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend.isPositive ? 'text-success bg-success/10' : 'text-error bg-error/10'}`}>
            {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-text-primary tracking-tight">
        {typeof value === 'number' ? `₹${value.toFixed(2)}` : value}
      </div>
    </div>
  );

  return href ? <Link href={href} className="block">{card}</Link> : card;
};
