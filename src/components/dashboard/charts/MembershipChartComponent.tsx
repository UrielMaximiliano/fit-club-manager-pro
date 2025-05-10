import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { 
  CHART_COLORS, 
  tooltipStyle, 
  barChartConfig, 
  colorArray,
  chartContainerClass,
  createBarGradient,
  getBarGradientId,
  GRADIENT_IDS
} from '../utils/chartConfig';

interface MembershipChartComponentProps {
  data: {
    name: string;
    miembros: number;
  }[];
  chartConfig: {
    members: {
      label: string;
      color: string;
    };
  };
}

const MembershipChartComponent: React.FC<MembershipChartComponentProps> = ({ data, chartConfig }) => {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-textSecondary">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 20, right: 40, left: 20, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray={barChartConfig.gridStrokeDasharray} 
            stroke={CHART_COLORS.grid} 
            opacity={barChartConfig.gridOpacity} 
            horizontal={true} 
            vertical={false} 
          />
          <XAxis 
            type="number"
            stroke={CHART_COLORS.textSecondary} 
            fontSize={barChartConfig.axisProps.fontSize}
            tickLine={barChartConfig.axisProps.tickLine}
            axisLine={true}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            stroke={CHART_COLORS.textSecondary} 
            fontSize={barChartConfig.axisProps.fontSize}
            tickLine={barChartConfig.axisProps.tickLine}
            axisLine={false}
            width={100}
          />
          <Tooltip
            contentStyle={tooltipStyle.contentStyle}
            formatter={(value) => [`${value} miembros`, '']}
            labelFormatter={(name) => `${name}`}
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
            dataKey="miembros" 
            fill={CHART_COLORS.primary}
            radius={barChartConfig.horizontalBarRadius} 
            name="Miembros"
            barSize={barChartConfig.barSize}
            animationDuration={barChartConfig.animationDuration}
          >
            <LabelList 
              dataKey="miembros" 
              position="right" 
              style={{ fill: CHART_COLORS.text, fontSize: '12px', fontWeight: '500' }} 
            />
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colorArray[index % colorArray.length]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MembershipChartComponent;
