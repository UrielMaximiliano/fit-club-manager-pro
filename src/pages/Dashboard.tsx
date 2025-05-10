
import React, { useEffect, useState, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { memberServices, attendanceServices, paymentServices } from '@/services';
import { useRealtimeDashboard } from '@/hooks/use-realtime-dashboard';

// Componentes de panel de control
import SummaryCards from '@/components/dashboard/SummaryCards';
import MembershipChart from '@/components/dashboard/MembershipChart';
import TypeDistribution from '@/components/dashboard/TypeDistribution';
import DetailedStats from '@/components/dashboard/DetailedStats';

// Utilidades para preparar datos
import { 
  prepareMembershipData, 
  prepareAttendanceData, 
  prepareRevenueData, 
  prepareMembershipTypeData, 
  calculateSummaryStats,
  SummaryStats,
  MembershipData,
  AttendanceData,
  RevenueData,
  MembershipTypeData
} from '@/components/dashboard/utils/dataPreparation';

// Chart configuration
import { colorArray } from '@/components/dashboard/utils/chartConfig';

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [membershipData, setMembershipData] = useState<MembershipData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [membershipTypeData, setMembershipTypeData] = useState<MembershipTypeData[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    activeMembers: 0,
    todayAttendance: 0,
    updatedRoutines: 0,
    monthlyRevenue: 0
  });

  // Función para cargar todos los datos del dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener datos de la API
      const membersData = await memberServices.getAll();
      const allAttendance = await attendanceServices.getAll();
      const payments = await paymentServices.getAll();
      
      // Calcular estadísticas de resumen
      const stats = calculateSummaryStats(membersData, allAttendance, payments);
      setSummaryStats(stats);
      
      // Preparar datos para gráficos
      setMembershipData(prepareMembershipData(membersData));
      setAttendanceData(prepareAttendanceData(allAttendance));
      setRevenueData(prepareRevenueData(payments));
      setMembershipTypeData(prepareMembershipTypeData(membersData));
      
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time dashboard updates
  const { loading: updatingData, lastUpdated, refreshDashboard } = useRealtimeDashboard({
    onMembersUpdate: fetchDashboardData,
    onMembershipsUpdate: fetchDashboardData,
    onPaymentsUpdate: fetchDashboardData,
    onAttendanceUpdate: fetchDashboardData,
  });

  // Obtener datos al cargar el componente
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Refrescar datos manualmente
  const handleRefresh = () => {
    refreshDashboard();
  };

  // Configuración para los gráficos
  const chartConfig = {
    members: { 
      label: "Miembros", 
      color: colorArray[0]
    }
  };

  // Componente para el spinner de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-8 mt-4">
        <div className={isMobile ? "ml-14" : ""}>
          <h1 className="text-xl md:text-2xl font-bold text-text">Dashboard</h1>
        </div>
        <div className="text-textSecondary text-sm md:text-base">
          {lastUpdated && (
            <span className="text-xs mr-2">
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          Administrador
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <SummaryCards stats={summaryStats} />

      {/* Gráficos principales, cada uno en su columna */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10 items-start">
        <MembershipChart 
          data={membershipData} 
          chartConfig={chartConfig} 
          onRefresh={handleRefresh} 
          isUpdating={updatingData} 
        />
        <TypeDistribution 
          data={membershipTypeData} 
          colors={colorArray} 
          onRefresh={handleRefresh}
          isUpdating={updatingData}
        />
        <DetailedStats 
          attendanceData={attendanceData}
          revenueData={revenueData}
          chartConfig={chartConfig}
          onRefresh={handleRefresh}
          isUpdating={updatingData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
