
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
  onRefresh?: () => void;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  attendanceData, 
  revenueData, 
  chartConfig,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'asistencias' | 'ingresos'>('asistencias');

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
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 col-span-1 lg:col-span-2">
      <CardHeader className="p-5 border-b border-border/40">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base md:text-lg text-text">Estadísticas Detalladas</CardTitle>
          <div className="flex gap-1">
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-textSecondary hover:text-text hover:bg-accent/10 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-textSecondary hover:text-text hover:bg-accent/10 rounded-full h-8 w-8 p-0 flex items-center justify-center"
              onClick={() => handleDownload('json')}
              disabled={isLoading}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs text-textSecondary hover:text-text h-8"
              onClick={() => handleDownload('csv')}
              disabled={isLoading}
            >
              CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-6">
        <Tabs 
          defaultValue="asistencias" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as 'asistencias' | 'ingresos')}
        >
          <TabsList className="grid w-full grid-cols-2 h-auto bg-muted rounded-lg mb-4">
            <TabsTrigger 
              value="asistencias"
              className="text-sm md:text-base py-2.5 data-[state=active]:bg-accent data-[state=active]:text-white rounded-md"
            >
              Asistencias
            </TabsTrigger>
            <TabsTrigger 
              value="ingresos" 
              className="text-sm md:text-base py-2.5 data-[state=active]:bg-accent data-[state=active]:text-white rounded-md"
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--text-secondary)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={true}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={true}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'var(--accent)', opacity: 0.1}}
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
              <p className="text-sm text-textSecondary">Asistencias diarias - Última semana</p>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="var(--text-secondary)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={true}
                    />
                    <YAxis 
                      stroke="var(--text-secondary)" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={true}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'var(--accent)', opacity: 0.1}}
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
              <p className="text-sm text-textSecondary">Ingresos mensuales - Últimos 6 meses</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedStats;
