// In a real application, we would use a charting library like Recharts, Victory, or Chart.js
// For this example, we'll create a simple SVG-based sparkline chart

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

export const RevenueChart = ({
  data,
  height = 150
}: RevenueChartProps) => {
  if (!data.datasets || data.datasets.length === 0) {
    return <div className="h-[150px] flex items-center justify-center text-text-muted">No data available</div>;
  }

  const dataset = data.datasets[0];
  const { data: values } = dataset;
  const { labels } = data;

  if (labels.length === 0 || values.length === 0) {
    return <div className="h-[150px] flex items-center justify-center text-text-muted">No data available</div>;
  }

  // Calculate chart dimensions
  const padding = 20;
  const chartWidth = 500; // Fixed width for simplicity; in production, use ref to measure parent
  const chartHeight = height - (padding * 2);

  // Find min and max values for scaling
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  // Handle case where all values are the same
  const adjustedRange = valueRange === 0 ? 1 : valueRange;

  // Calculate points for the line
  const points = values.map((value, index) => {
    const x = padding + (index / (values.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - (((value - minValue) / adjustedRange) * chartHeight) + padding;
    return { x, y };
  });

  // Create the path string for the line
  const pathPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const pathLine = `M${pathPoints}`;

  // Create area under the line (for gradient fill)
  const areaPath = `M${points[0].x},${chartHeight + padding} L${pathPoints} L${points[points.length - 1].x},${chartHeight + padding} Z`;

  return (
    <div className="relative h-[150px] w-full">
      <svg className="absolute inset-0" aria-hidden="true">
        {/* Area under the line */}
        <path
          d={areaPath}
          fill={dataset.backgroundColor}
        />
        {/* Line */}
        <path
          d={pathLine}
          fill="none"
          stroke={dataset.borderColor}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={dataset.borderColor}
          />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex px-4 pb-2 justify-between">
        {labels.map((label: string, index: number) => (
          <div
            key={index}
            className="text-xs text-text-muted text-center flex-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col items-center justify-between pl-2 pt-2">
        {[maxValue, ((maxValue + minValue) / 2), minValue].map((value, index) => (
          <div
            key={index}
            className="text-xs text-text-muted text-right w-8"
          >
            {value.toFixed(0)}
          </div>
        ))}
      </div>
    </div>
  );
};
