
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { 
  CHART_COLORS, 
  tooltipStyle, 
  lineChartConfig,
  chartContainerClass,
  createAreaGradient,
  getAreaGradientId,
  GRADIENT_IDS,
} from '../utils/chartConfig';

interface RevenueData {
  name: string;
  ingresos: number;
}

interface RevenueAreaChartProps {
  data: RevenueData[];
}

const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({ data }) => {
  return (
    <div className={`h-[260px] md:h-[300px] xl:h-[320px] ${chartContainerClass}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray={lineChartConfig.gridStrokeDasharray} 
            stroke={CHART_COLORS.grid}
            opacity={lineChartConfig.gridOpacity}
            vertical={false} 
          />
          <XAxis 
            dataKey="name" 
            stroke={CHART_COLORS.textSecondary} 
            fontSize={lineChartConfig.axisProps.fontSize}
            tickLine={lineChartConfig.axisProps.tickLine}
            axisLine={true}
          />
          <YAxis 
            stroke={CHART_COLORS.textSecondary} 
            fontSize={lineChartConfig.axisProps.fontSize}
            tickLine={lineChartConfig.axisProps.tickLine}
            axisLine={true}
          />
          <Tooltip
            contentStyle={tooltipStyle.contentStyle}
            formatter={(value) => [`$${value.toLocaleString()}`, '']}
            labelFormatter={(name) => `${name}`}
            cursor={{ stroke: CHART_COLORS.textSecondary, strokeDasharray: '3 3', strokeWidth: 1 }}
          />
          <defs>
            {(() => {
              const gradient = createAreaGradient(GRADIENT_IDS.area);
              return (
                <linearGradient 
                  id={gradient.id}
                  x1={gradient.x1}
                  y1={gradient.y1}
                  x2={gradient.x2}
                  y2={gradient.y2}
                >
                  {gradient.stops.map((stop, stopIndex) => (
                    <stop 
                      key={`stop-${stopIndex}`}
                      offset={stop.offset}
                      stopColor={stop.stopColor}
                      stopOpacity={stop.stopOpacity}
                    />
                  ))}
                </linearGradient>
              );
            })()}
          </defs>
          <Area 
            type="monotone" 
            dataKey="ingresos" 
            stroke={CHART_COLORS.primary} 
            fill={getAreaGradientId(GRADIENT_IDS.area)}
            strokeWidth={lineChartConfig.strokeWidth}
            animationDuration={lineChartConfig.animationDuration}
            dot={{ r: lineChartConfig.dotRadius, fill: CHART_COLORS.primary, stroke: "var(--card)", strokeWidth: 2 }}
            activeDot={{ r: lineChartConfig.activeDotRadius, fill: CHART_COLORS.primary, stroke: "var(--card)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-center mt-3">
        <p className="text-sm text-textSecondary">Ingresos mensuales - Últimos 6 meses</p>
      </div>
    </div>
  );
};

export default RevenueAreaChart;
