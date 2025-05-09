
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { memberServices } from '@/services/supabaseService';

interface MembershipTypeData {
  name: string;
  value: number;
}

interface TypeDistributionProps {
  data: MembershipTypeData[];
  colors: string[];
  onRefresh?: () => void;
}

const TypeDistribution: React.FC<TypeDistributionProps> = ({ data, colors, onRefresh }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (type: 'json' | 'csv') => {
    setIsLoading(true);
    try {
      // Obtener miembros frescos de Supabase y calcular la distribución
      const freshMembers = await memberServices.getAll();
      const membershipTypes = {};
      freshMembers.forEach(m => {
        if (membershipTypes[m.membership_type]) {
          membershipTypes[m.membership_type]++;
        } else {
          membershipTypes[m.membership_type] = 1;
        }
      });
      const freshData = Object.entries(membershipTypes).map(([name, value]) => ({ name, value }));
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
        fileName = 'membership_types.json';
      } else {
        // CSV
        const header = Object.keys(freshData[0]).join(',');
        const rows = freshData.map(row => Object.values(row).join(','));
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([header, ...rows].join('\n'));
        fileName = 'membership_types.csv';
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

  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    // Show percentages next to the pie segments
    return `${(percent * 100).toFixed(0)}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 border border-border rounded-md shadow-md">
          <p className="font-medium text-text">{payload[0].name}</p>
          <p className="text-sm text-textSecondary">
            <span className="font-semibold">{payload[0].value}</span> miembros
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLegend = () => {
    return (
      <div className="flex justify-center flex-wrap gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-1 rounded-sm"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-xs text-textSecondary">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="p-5 border-b border-border/40">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-text">Distribución de Membresías</CardTitle>
            <CardDescription className="text-sm text-textSecondary mt-1">
              Tipos de membresías activas
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
        <div className="h-[240px] md:h-[280px] xl:h-[300px] flex justify-center">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderLabel}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      stroke="var(--card)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <RechartsTooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-textSecondary">
              No hay datos disponibles
            </div>
          )}
        </div>
        {data.length > 0 && renderCustomizedLegend()}
      </CardContent>
    </Card>
  );
};

export default TypeDistribution;
