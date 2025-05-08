
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
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

  const renderCustomizedLegend = () => {
    return (
      <div className="flex justify-center flex-wrap gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div className="w-3 h-3 mr-1" style={{ backgroundColor: colors[index % colors.length] }}></div>
            <span className="text-xs text-gray-500 dark:text-gray-300">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-card border border-border shadow-lg">
      <CardHeader className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-text">Distribución de Membresías</CardTitle>
            <CardDescription className="text-sm text-textSecondary mt-1">
              Tipos de membresías activas
            </CardDescription>
          </div>
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
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} miembros`, name]}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px', color: '#000' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
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
