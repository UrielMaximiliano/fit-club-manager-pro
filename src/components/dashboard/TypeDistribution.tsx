
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface MembershipTypeData {
  name: string;
  value: number;
}

interface TypeDistributionProps {
  data: MembershipTypeData[];
  colors: string[];
}

const TypeDistribution: React.FC<TypeDistributionProps> = ({ data, colors }) => {
  return (
    <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
      <CardHeader className="p-3 md:p-6">
        <CardTitle className="text-sm md:text-lg text-white">Distribución de Membresías</CardTitle>
        <CardDescription className="text-xs md:text-sm text-gray-400">
          Tipos de membresías activas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 md:p-2">
        <div className="h-[200px] md:h-[240px] flex justify-center">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                  formatter={(value) => <span style={{ color: '#999' }}>{value}</span>}
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
