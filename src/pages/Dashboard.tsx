
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { memberServices, attendanceServices, paymentServices } from '@/services/supabaseService';

// Componentes de panel de control
import SummaryCards from '@/components/dashboard/SummaryCards';
import MembershipChart from '@/components/dashboard/MembershipChart';
import RecentActivities from '@/components/dashboard/RecentActivities';
import TypeDistribution from '@/components/dashboard/TypeDistribution';
import DetailedStats from '@/components/dashboard/DetailedStats';

// Utilidades para preparar datos
import { 
  prepareMembershipData, 
  prepareAttendanceData, 
  prepareRevenueData, 
  prepareMembershipTypeData, 
  prepareRecentActivities,
  calculateSummaryStats,
  SummaryStats,
  MembershipData,
  AttendanceData,
  RevenueData,
  MembershipTypeData,
  RecentActivity
} from '@/components/dashboard/utils/dataPreparation';

// Colores para los gráficos
const COLORS = ['#4F8EF6', '#22C55E', '#A855F7', '#F97316', '#9b87f5'];

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [membershipData, setMembershipData] = useState<MembershipData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [membershipTypeData, setMembershipTypeData] = useState<MembershipTypeData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    activeMembers: 0,
    todayAttendance: 0,
    updatedRoutines: 0,
    monthlyRevenue: 0
  });

  // Función para cargar todos los datos del dashboard
  const fetchDashboardData = async () => {
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
      setRecentActivities(prepareRecentActivities(membersData, payments, allAttendance));
      
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
  };

  // Obtener datos al cargar el componente
  useEffect(() => {
    fetchDashboardData();
    
    // Configurar suscripciones en tiempo real
    const unsubscribeMembers = memberServices.onDataChange(() => {
      console.log("Actualización en miembros detectada");
      fetchDashboardData();
      toast({
        title: "Datos actualizados",
        description: "Los datos de miembros han sido actualizados",
      });
    });
    
    const unsubscribeMemberships = memberServices.onDataChange(() => {
      console.log("Actualización en membresías detectada");
      fetchDashboardData();
    });
    
    const unsubscribePayments = paymentServices.onDataChange(() => {
      console.log("Actualización en pagos detectada");
      fetchDashboardData();
      toast({
        title: "Datos actualizados",
        description: "Los datos de pagos han sido actualizados",
      });
    });
    
    const unsubscribeAttendance = attendanceServices.onDataChange(() => {
      console.log("Actualización en asistencias detectada");
      fetchDashboardData();
      toast({
        title: "Datos actualizados",
        description: "Los datos de asistencias han sido actualizados",
      });
    });
    
    return () => {
      // Limpiar suscripciones
      unsubscribeMembers();
      unsubscribeMemberships();
      unsubscribePayments();
      unsubscribeAttendance();
    };
  }, []);

  // Configuración para los gráficos
  const chartConfig = {
    members: { 
      label: "Miembros", 
      color: "#4F8EF6" 
    },
    attendance: { 
      label: "Asistencias", 
      color: "#22C55E" 
    },
    revenue: { 
      label: "Ingresos", 
      color: "#A855F7" 
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
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <div className={isMobile ? "ml-14" : ""}>
          <h1 className="text-xl md:text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="text-white text-sm md:text-base">Administrador</div>
      </div>

      {/* Tarjetas de resumen */}
      <SummaryCards stats={summaryStats} />

      {/* Sección principal con gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <MembershipChart data={membershipData} chartConfig={chartConfig} />
        <RecentActivities activities={recentActivities} />
      </div>

      {/* Sección de estadísticas avanzadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <TypeDistribution data={membershipTypeData} colors={COLORS} />
        <DetailedStats 
          attendanceData={attendanceData}
          revenueData={revenueData}
          chartConfig={chartConfig}
        />
      </div>
    </div>
  );
};

export default Dashboard;
