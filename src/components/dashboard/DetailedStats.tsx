
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { attendanceServices, paymentServices } from '@/services/supabaseService';
import AttendanceBarChart from './charts/AttendanceBarChart';
import RevenueAreaChart from './charts/RevenueAreaChart';
import DataExportActions from './actions/DataExportActions';

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
  isUpdating?: boolean;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  attendanceData, 
  revenueData, 
  chartConfig,
  onRefresh,
  isUpdating = false
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'asistencias' | 'ingresos'>('asistencias');

  // Calcular el promedio de asistencias
  const calculateAttendanceAverage = () => {
    if (!attendanceData || attendanceData.length === 0) return 0;
    const sum = attendanceData.reduce((acc, curr) => acc + curr.asistencias, 0);
    return Math.round(sum / attendanceData.length);
  };

  const attendanceAverage = calculateAttendanceAverage();

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
    <Card className={`bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 col-span-1 lg:col-span-1 ${isUpdating ? 'data-update' : ''}`}>
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
                disabled={isLoading || isUpdating}
              >
                <RefreshCw className={`h-4 w-4 ${(isLoading || isUpdating) ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <DataExportActions 
              onExport={handleDownload}
              isLoading={isLoading}
            />
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
            <AttendanceBarChart 
              data={attendanceData}
              average={attendanceAverage}
            />
          </TabsContent>
          <TabsContent value="ingresos" className="mt-0">
            <RevenueAreaChart data={revenueData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedStats;
