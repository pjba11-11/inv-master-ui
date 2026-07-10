import React from 'react';

// Base shimmer block
export const Skeleton = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} style={style} />
);

// ─── Composites ────────────────────────────────────────────────────────────

export const StatCardSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-xl p-5 space-y-3" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-7 w-32" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
    {/* Header */}
    <div className="flex gap-4 px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-2)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={{ width: i === 0 ? '30%' : `${60 / (cols - 1)}%` }} />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex gap-4 px-4 py-3.5" style={{ borderBottom: r < rows - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4" style={{ width: c === 0 ? '30%' : `${60 / (cols - 1)}%`, opacity: 0.6 + (r % 3) * 0.1 }} />
        ))}
      </div>
    ))}
  </div>
);

export const DetailSkeleton = ({ fields = 6 }: { fields?: number }) => (
  <div className="rounded-xl p-6 space-y-5" style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>
      ))}
    </div>
  </div>
);

export const FormSkeleton = ({ fields = 4 }: { fields?: number }) => (
  <div className="rounded-xl p-6 space-y-5" style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
    <Skeleton className="h-5 w-40 mb-2" />
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-xl p-6" style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
    <Skeleton className="h-5 w-40 mb-6" />
    <div className="flex items-end gap-3 h-40">
      {[60, 80, 45, 90, 70, 55, 85].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
      ))}
    </div>
    <div className="flex gap-3 mt-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="flex-1 h-3" />
      ))}
    </div>
  </div>
);
