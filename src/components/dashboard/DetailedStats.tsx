
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
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { attendanceServices, paymentServices } from '@/services/supabaseService';
import { 
  CHART_COLORS, 
  tooltipStyle, 
  barChartConfig, 
  lineChartConfig,
  referenceLineConfig,
  chartContainerClass,
  getAreaGradient,
  getBarGradient
} from './utils/chartConfig';

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

  // Calcular el promedio de asistencias
  const calculateAttendanceAverage = () => {
    if (!attendanceData || attendanceData.length === 0) return 0;
    const sum = attendanceData.reduce((acc, curr) => acc + curr.asistencias, 0);
    return Math.round(sum / attendanceData.length);
  };

  const attendanceAverage = calculateAttendanceAverage();

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
            <div className={`h-[260px] md:h-[300px] xl:h-[320px] ${chartContainerClass}`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={attendanceData} 
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
                    y={attendanceAverage} 
                    stroke={referenceLineConfig.stroke} 
                    strokeDasharray={referenceLineConfig.strokeDasharray} 
                    label={{ 
                      value: `Prom: ${attendanceAverage}`, 
                      position: 'right', 
                      fill: referenceLineConfig.label.fill, 
                      fontSize: referenceLineConfig.label.fontSize
                    }} 
                  />
                  <Bar 
                    dataKey="asistencias" 
                    radius={barChartConfig.barRadius} 
                    name="Asistencias" 
                    animationDuration={barChartConfig.animationDuration}
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#colorGradient${index})`} 
                      />
                    ))}
                    <defs>
                      {attendanceData.map((entry, index) => (
                        <linearGradient 
                          key={`gradient-${index}`}
                          id={`colorGradient${index}`} 
                          x1="0" 
                          y1="0" 
                          x2="0" 
                          y2="1"
                        >
                          <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.8} />
                          <stop offset="100%" stopColor={CHART_COLORS.background} stopOpacity={0.2} />
                        </linearGradient>
                      ))}
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-3">
              <p className="text-sm text-textSecondary">Asistencias diarias - Última semana</p>
            </div>
          </TabsContent>
          <TabsContent value="ingresos" className="mt-0">
            <div className={`h-[260px] md:h-[300px] xl:h-[320px] ${chartContainerClass}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={revenueData} 
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
                  {getAreaGradient('colorIngresos')}
                  <Area 
                    type="monotone" 
                    dataKey="ingresos" 
                    stroke={CHART_COLORS.primary} 
                    fill="url(#colorIngresos)"
                    strokeWidth={lineChartConfig.strokeWidth}
                    animationDuration={lineChartConfig.animationDuration}
                    dot={{ r: lineChartConfig.dotRadius, fill: CHART_COLORS.primary, stroke: "var(--card)", strokeWidth: 2 }}
                    activeDot={{ r: lineChartConfig.activeDotRadius, fill: CHART_COLORS.primary, stroke: "var(--card)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
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
