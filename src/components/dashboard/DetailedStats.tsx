import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { MembershipExport } from '../dashboard/actions/MembershipExport';
import { ChartTabs } from './ChartTabs';
import { useToast } from '@/hooks/use-toast';
import { attendanceServices, paymentServices } from '@/services';

interface DetailedStatsProps {
  attendanceData: { day: string; asistencias: number }[];
  revenueData: { payment_date: string; amount: number }[];
  chartConfig: any;
  onRefresh?: () => void;
  isUpdating?: boolean;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ 
  attendanceData, 
  revenueData, 
  chartConfig,
  onRefresh,
  isUpdating
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('attendance');

  // Preparar datos de ingresos mensuales
  const monthlyRevenueData = React.useMemo(() => {
    const monthlyData: { month: string; revenue: number }[] = [];
    const monthlyRevenueMap: { [key: string]: number } = {};

    revenueData.forEach(item => {
      const date = new Date(item.payment_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;

      if (monthlyRevenueMap[monthYear]) {
        monthlyRevenueMap[monthYear] += item.amount;
      } else {
        monthlyRevenueMap[monthYear] = item.amount;
      }
    });

    for (const monthYear in monthlyRevenueMap) {
      monthlyData.push({
        month: monthYear,
        revenue: monthlyRevenueMap[monthYear]
      });
    }

    return monthlyData;
  }, [revenueData]);

  return (
    <Card className="bg-[#1A1F2C] border-gray-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="text-lg font-semibold">Estadísticas Detalladas</CardTitle>
          <CardDescription className="text-gray-400">
            Asistencias y Ingresos mensuales
          </CardDescription>
        </div>
        <MembershipExport onRefresh={onRefresh} isUpdating={isUpdating} />
      </CardHeader>
      <CardContent>
        <ChartTabs 
          tabs={[
            { label: 'Asistencias', value: 'attendance' },
            { label: 'Ingresos', value: 'revenue' }
          ]}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {activeTab === 'attendance' && (
          <>
            {attendanceData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="day" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="asistencias" stroke={chartConfig.members.color} name="Asistencias" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-gray-500">No hay datos de asistencia disponibles.</div>
            )}
          </>
        )}
        {activeTab === 'revenue' && (
          <>
            {monthlyRevenueData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis dataKey="month" stroke="#999" />
                    <YAxis stroke="#999" />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke={chartConfig.members.color} name="Ingresos" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-gray-500">No hay datos de ingresos disponibles.</div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DetailedStats;
