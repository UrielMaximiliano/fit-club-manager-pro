
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface MembershipTypeData {
  name: string;
  value: number;
}

interface TypeDistributionProps {
  data: MembershipTypeData[];
  colors: string[];
}

const TypeDistribution: React.FC<TypeDistributionProps> = ({ data, colors }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

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
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm md:text-base text-white">Distribución de Membresías</CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Tipos de membresías activas
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-[220px] md:h-[240px] flex justify-center">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={renderLabel}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} miembros`, name]}
                  contentStyle={{ backgroundColor: '#222732', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value) => <span style={{ color: '#999', fontSize: '12px' }}>{value}</span>}
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
