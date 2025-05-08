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
import { useToast } from '@/hooks/use-toast';
import { attendanceServices, paymentServices } from '@/services/supabaseService';

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
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  attendanceData, 
  revenueData, 
  chartConfig 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'asistencias' | 'ingresos'>('asistencias');

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDownload = async (type: 'json' | 'csv') => {
    setIsLoading(true);
    try {
      // Obtener datos frescos de Supabase
      const freshAttendance = await attendanceServices.getAll();
      const freshRevenue = await paymentServices.getAll();
      const data = activeTab === 'asistencias' ? freshAttendance : freshRevenue;
      if (!data || data.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay datos para exportar',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      let dataStr = '';
      let fileName = '';
      if (type === 'json') {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
        fileName = activeTab === 'asistencias' ? 'attendance_data.json' : 'revenue_data.json';
      } else {
        // CSV
        const header = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([header, ...rows].join('\n'));
        fileName = activeTab === 'asistencias' ? 'attendance_data.csv' : 'revenue_data.csv';
      }
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', fileName);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({
        title: 'Descarga exitosa',
        description: `Archivo ${fileName} descargado correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo obtener los datos actualizados',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-card border border-border shadow-lg col-span-1 lg:col-span-2">
      <CardHeader className="p-5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base md:text-lg text-text">Estadísticas Detalladas</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => handleDownload('json')}
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => handleDownload('csv')}
            >
              CSV
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
          <TabsList className="grid w-full grid-cols-2 h-auto bg-[#222732] mb-4">
            <TabsTrigger 
              value="asistencias"
              className="text-sm md:text-base py-3 data-[state=active]:bg-blue-700"
            >
              Asistencias
            </TabsTrigger>
            <TabsTrigger 
              value="ingresos" 
              className="text-sm md:text-base py-3 data-[state=active]:bg-blue-700"
            >
              Ingresos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="asistencias" className="mt-0">
            <div className="h-[260px] md:h-[300px] xl:h-[320px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" fontSize={12} />
                    <YAxis stroke="#999" fontSize={12} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    />
                    <Bar dataKey="asistencias" fill="#22C55E" radius={[4, 4, 0, 0]} name="Asistencias" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-400">Asistencias diarias - Última semana</p>
            </div>
          </TabsContent>
          <TabsContent value="ingresos" className="mt-0">
            <div className="h-[260px] md:h-[300px] xl:h-[320px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" fontSize={12} />
                    <YAxis stroke="#999" fontSize={12} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    />
                    <Bar dataKey="ingresos" fill="#A855F7" radius={[4, 4, 0, 0]} name="Ingresos" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-gray-400">Ingresos mensuales - Últimos 6 meses</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedStats;
