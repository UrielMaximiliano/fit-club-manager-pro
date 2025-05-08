
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
import { Download, RefreshCw } from 'lucide-react';

interface AttendanceData {
  name: string;
  asistencias: number;
}

interface RevenueData {
  name: string;
  ingresos: number;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface DetailedStatsProps {
  attendanceData: AttendanceData[];
  revenueData: RevenueData[];
  chartConfig: ChartConfig;
  onRefresh?: () => void;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  attendanceData, 
  revenueData, 
  chartConfig,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'asistencias' | 'ingresos'>('asistencias');

  const handleDownload = () => {
    // Simulating download functionality
    const data = activeTab === 'asistencias' ? attendanceData : revenueData;
    const fileName = activeTab === 'asistencias' ? 'attendance_data.json' : 'revenue_data.json';
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <Card className="bg-white dark:bg-[#1A1F2C] border-gray-200 dark:border-gray-800 shadow-lg col-span-1 lg:col-span-2">
      <CardHeader className="p-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base md:text-lg text-gray-900 dark:text-white">Estadísticas Detalladas</CardTitle>
          <div className="flex gap-2">
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onRefresh}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <Tabs 
          defaultValue="asistencias" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as 'asistencias' | 'ingresos')}
        >
          <TabsList className="grid w-full grid-cols-2 h-auto bg-gray-100 dark:bg-[#222732] mb-4">
            <TabsTrigger 
              value="asistencias"
              className="text-sm md:text-base py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Asistencias
            </TabsTrigger>
            <TabsTrigger 
              value="ingresos" 
              className="text-sm md:text-base py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Ingresos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="asistencias" className="mt-0">
            <div className="h-[260px] md:h-[300px] xl:h-[320px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={attendanceData} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
                    />
                    <Bar 
                      dataKey="asistencias" 
                      fill="#22C55E" 
                      radius={[4, 4, 0, 0]} 
                      name="Asistencias" 
                      animationBegin={0}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Asistencias diarias - Última semana</p>
            </div>
          </TabsContent>
          <TabsContent value="ingresos" className="mt-0">
            <div className="h-[260px] md:h-[300px] xl:h-[320px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={revenueData} 
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'rgba(0, 0, 0, 0.05)'}}
                    />
                    <Bar 
                      dataKey="ingresos" 
                      fill="#A855F7" 
                      radius={[4, 4, 0, 0]} 
                      name="Ingresos" 
                      animationBegin={0}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos mensuales - Últimos 6 meses</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedStats;
