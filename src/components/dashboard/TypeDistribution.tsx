
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MembershipTypeData {
  name: string;
  value: number;
}

interface TypeDistributionProps {
  data: MembershipTypeData[];
  colors: string[];
}

const TypeDistribution: React.FC<TypeDistributionProps> = ({ data, colors }) => {
  const handleDownload = () => {
    // Simulating download functionality
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "membership_types.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    // Simplified label format to prevent truncation
    return `${(percent * 100).toFixed(0)}%`;
  };

  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 max-h-20 overflow-y-auto">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1 text-xs sm:text-sm">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300 text-ellipsis overflow-hidden max-w-[150px] whitespace-nowrap" title={entry.value}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
      <CardHeader className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-base md:text-lg text-white">Distribución de Membresías</CardTitle>
            <CardDescription className="text-sm text-gray-400 mt-1">
              Tipos de membresías activas
            </CardDescription>
          </div>
          <div className="flex gap-2">
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
        <div className="h-[240px] md:h-[280px] xl:h-[300px] flex justify-center">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderLabel}
                  animationBegin={0}
                  animationDuration={500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} miembros`, name]}
                  contentStyle={{ backgroundColor: '#222732', border: '1px solid #333', padding: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  content={renderCustomizedLegend}
                  layout="horizontal" 
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No hay datos disponibles
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TypeDistribution;
