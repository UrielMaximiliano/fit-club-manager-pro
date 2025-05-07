
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn } from 'lucide-react';

interface MembershipData {
  name: string;
  miembros: number;
}

interface MembershipChartProps {
  data: MembershipData[];
  chartConfig: {
    members: {
      label: string;
      color: string;
    };
  };
}

const MembershipChart: React.FC<MembershipChartProps> = ({ data, chartConfig }) => {
  const handleDownload = () => {
    // Simulating download functionality
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "membership_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleZoom = () => {
    // In a real app, this could open a modal with a larger view of the chart
    console.log("Zoom chart functionality to be implemented");
  };

  return (
    <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg col-span-1 lg:col-span-2">
      <CardHeader className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-white">Análisis de Membresías</CardTitle>
            <CardDescription className="text-sm text-gray-400 mt-1">
              Evolución de miembros en los últimos 6 meses
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleZoom}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="h-[260px] md:h-[300px] xl:h-[340px]">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                />
                <Bar dataKey="miembros" fill="#4F8EF6" radius={[4, 4, 0, 0]} name="Miembros" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipChart;
