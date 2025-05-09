
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

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 col-span-1 lg:col-span-2">
      <CardHeader className="p-5 border-b border-border/40">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-text">Análisis de Membresías</CardTitle>
            <CardDescription className="text-sm text-textSecondary mt-1">
              Evolución de miembros en los últimos 6 meses
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
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-secondary)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={true}
                    padding={{ left: 10, right: 10 }}
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
                    dataKey="miembros" 
                    fill="var(--accent)" 
                    radius={[4, 4, 0, 0]} 
                    name="Miembros"
                    animationBegin={0}
                    animationDuration={800}
                  />
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
