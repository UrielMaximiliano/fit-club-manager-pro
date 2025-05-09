
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { 
  CHART_COLORS, 
  tooltipStyle, 
  barChartConfig, 
  referenceLineConfig,
  chartContainerClass,
  createBarGradient,
  getBarGradientId,
  GRADIENT_IDS,
} from '../utils/chartConfig';

interface AttendanceData {
  name: string;
  asistencias: number;
}

interface AttendanceBarChartProps {
  data: AttendanceData[];
  average: number;
}

const AttendanceBarChart: React.FC<AttendanceBarChartProps> = ({ data, average }) => {
  return (
    <div className={`h-[260px] md:h-[300px] xl:h-[320px] ${chartContainerClass}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 10, left: 0, bottom: 30 }}
        >
          <CartesianGrid 
            strokeDasharray={barChartConfig.gridStrokeDasharray} 
            stroke={CHART_COLORS.grid} 
            opacity={barChartConfig.gridOpacity} 
            vertical={false} 
          />
          <XAxis 
            dataKey="name" 
            stroke={CHART_COLORS.textSecondary} 
            fontSize={barChartConfig.axisProps.fontSize}
            tickLine={barChartConfig.axisProps.tickLine}
            axisLine={true}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            stroke={CHART_COLORS.textSecondary} 
            fontSize={barChartConfig.axisProps.fontSize}
            tickLine={barChartConfig.axisProps.tickLine}
            axisLine={true}
          />
          <Tooltip
            contentStyle={tooltipStyle.contentStyle}
            formatter={(value) => [`${value} asistentes`, '']}
            labelFormatter={(name) => `${name}`}
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          />
          <ReferenceLine 
            y={average} 
            stroke={referenceLineConfig.stroke} 
            strokeDasharray={referenceLineConfig.strokeDasharray} 
            label={{ 
              value: `Prom: ${average}`, 
              position: 'right', 
              fill: referenceLineConfig.label.fill, 
              fontSize: referenceLineConfig.label.fontSize
            }} 
          />
          <defs>
            {data.map((entry, index) => {
              const gradient = createBarGradient(GRADIENT_IDS.bar, index);
              return (
                <linearGradient 
                  key={`gradient-${index}`}
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
            })}
          </defs>
          <Bar 
            dataKey="asistencias" 
            radius={barChartConfig.barRadius} 
            name="Asistencias" 
            animationDuration={barChartConfig.animationDuration}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarGradientId(GRADIENT_IDS.bar, index)} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-3">
        <p className="text-sm text-textSecondary">Asistencias diarias - Última semana</p>
      </div>
    </div>
  );
};

export default AttendanceBarChart;
