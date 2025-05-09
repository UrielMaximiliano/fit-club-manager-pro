
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList,
  Cell // Add this import
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Download, ZoomIn, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { memberServices } from '@/services/supabaseService';

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
  onRefresh?: () => void;
}

const MembershipChart: React.FC<MembershipChartProps> = ({ data, chartConfig, onRefresh }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDownload = async (type: 'json' | 'csv') => {
    setIsLoading(true);
    try {
      // Obtener datos frescos de Supabase
      const freshData = await memberServices.getAll();
      if (!freshData || freshData.length === 0) {
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
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(freshData));
        fileName = 'membership_data.json';
      } else {
        // CSV
        const header = Object.keys(freshData[0]).join(',');
        const rows = freshData.map(row => Object.values(row).join(','));
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([header, ...rows].join('\n'));
        fileName = 'membership_data.csv';
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

  const handleZoom = () => {
    // In a real app, this could open a modal with a larger view of the chart
    console.log("Zoom chart functionality to be implemented");
  };

  // Colores actualizados a tonos verdes agua y gris claro
  const barColors = ['#4ECDC4', '#5DADE2', '#7DCEA0', '#7FB3D5'];

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 col-span-1 lg:col-span-2">
      <CardHeader className="p-5 border-b border-border/40">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-text">Membresías Activas</CardTitle>
            <CardDescription className="text-sm text-textSecondary mt-1">
              Distribución por tipo de membresía
            </CardDescription>
          </div>
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
              onClick={handleZoom}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
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
        <div className="h-[260px] md:h-[300px] xl:h-[340px]">
          {data.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data} 
                  layout="vertical"
                  margin={{ top: 20, right: 40, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} horizontal={true} vertical={false} />
                  <XAxis 
                    type="number"
                    stroke="#9F9EA1" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    stroke="#9F9EA1" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E3E8F0',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value} miembros`, '']}
                    labelFormatter={(name) => `${name}`}
                  />
                  <Bar 
                    dataKey="miembros" 
                    fill="#4ECDC4"
                    radius={[0, 4, 4, 0]} 
                    name="Miembros"
                    barSize={30}
                    animationDuration={800}
                  >
                    <LabelList 
                      dataKey="miembros" 
                      position="right" 
                      style={{ fill: '#5A6275', fontSize: '12px', fontWeight: '500' }} 
                    />
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-textSecondary">
              No hay datos disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipChart;
