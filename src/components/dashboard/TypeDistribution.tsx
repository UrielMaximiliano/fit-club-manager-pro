
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import MembershipExport from './actions/MembershipExport';
import { useToast } from '@/hooks/use-toast';
import { memberServices } from '@/services';

interface TypeDistributionProps {
  data: { name: string; value: number }[];
  colors: string[];
  onRefresh?: () => void;
  isUpdating?: boolean;
}

const TypeDistribution: React.FC<TypeDistributionProps> = ({ 
  data, 
  colors,
  onRefresh,
  isUpdating = false
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  if (!data || data.length === 0) {
    return (
      <Card className="bg-background border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Membership Type Distribution</CardTitle>
          <MembershipExport onRefresh={onRefresh} isUpdating={isUpdating} />
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Membership Type Distribution</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Breakdown of membership types
          </CardDescription>
        </div>
        <MembershipExport onRefresh={onRefresh} isUpdating={isUpdating} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={isMobile ? null : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TypeDistribution;
