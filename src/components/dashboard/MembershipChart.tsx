import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MembershipChartComponent from './charts/MembershipChartComponent';
import MembershipExport from './actions/MembershipExport';
import { MembershipData, ChartConfig } from './types';

interface MembershipChartProps {
  data: MembershipData[];
  chartConfig: ChartConfig;
  onRefresh?: () => void;
  isUpdating?: boolean;
}

const MembershipChart: React.FC<MembershipChartProps> = ({ 
  data, 
  chartConfig, 
  onRefresh,
  isUpdating = false
}) => {
  const handleZoom = () => {
    // In a real app, this could open a modal with a larger view of the chart
    console.log("Zoom chart functionality to be implemented");
  };

  return (
    <Card className={`bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 col-span-1 lg:col-span-2 ${isUpdating ? 'data-update' : ''}`}>
      <CardHeader className="p-5 border-b border-border/40">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-text">Membresías Activas</CardTitle>
            <CardDescription className="text-sm text-textSecondary mt-1">
              Distribución por tipo de membresía
            </CardDescription>
          </div>
          <MembershipExport 
            onRefresh={onRefresh}
            isUpdating={isUpdating}
            onZoom={handleZoom}
          />
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-6">
        <div className="w-full" style={{ height: 340 }}>
          <MembershipChartComponent data={data} chartConfig={chartConfig} />
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipChart;
