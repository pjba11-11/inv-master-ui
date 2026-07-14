'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }>;
}

interface RevenueChartProps {
  data: ChartData;
  height?: number;
}

function CustomTooltip({ active, payload, label, seriesLabel }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  seriesLabel: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-lg"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}
    >
      <p className="text-text-muted mb-1">{label}</p>
      <p className="text-text-primary font-semibold">
        {seriesLabel}: ₹{payload[0].value.toLocaleString('en-IN')}
      </p>
    </div>
  );
}

export const RevenueChart = ({ data, height = 150 }: RevenueChartProps) => {
  if (!data.datasets || data.datasets.length === 0) {
    return <div style={{ height }} className="flex items-center justify-center text-text-muted">No data available</div>;
  }

  const dataset = data.datasets[0];
  const { labels } = data;

  if (labels.length === 0 || dataset.data.length === 0) {
    return <div style={{ height }} className="flex items-center justify-center text-text-muted">No data available</div>;
  }

  const chartData = labels.map((label, i) => ({
    label,
    value: dataset.data[i],
  }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={dataset.borderColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={dataset.borderColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--border-subtle)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={v => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          />
          <Tooltip content={<CustomTooltip seriesLabel={dataset.label} />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={dataset.borderColor}
            strokeWidth={2}
            fill="url(#revenueFill)"
            dot={{ r: 3, fill: dataset.borderColor, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
