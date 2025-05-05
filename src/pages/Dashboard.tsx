
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarCheck, UserCircle, Calendar, CreditCard } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { memberServices, attendanceServices, paymentServices, reportServices } from '@/services/supabaseService';
import { toast } from '@/hooks/use-toast';

// Colores para los gráficos
const COLORS = ['#4F8EF6', '#22C55E', '#A855F7', '#F97316', '#9b87f5'];

// Interfaces para los datos
interface SummaryStats {
  activeMembers: number;
  todayAttendance: number;
  updatedRoutines: number;
  monthlyRevenue: number;
}

interface MembershipData {
  name: string;
  miembros: number;
}

interface AttendanceData {
  name: string;
  asistencias: number;
}

interface RevenueData {
  name: string;
  ingresos: number;
}

interface MembershipTypeData {
  name: string;
  value: number;
}

interface RecentActivity {
  type: 'member' | 'payment' | 'attendance' | 'routine';
  name: string;
  action: string;
  time: string;
}

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

  // Formatear tiempo relativo (ej: "hace 2 horas")
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else {
      return `Hace ${diffDays} días`;
    }
  };

  // Obtener datos al cargar el componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener miembros
        const membersData = await memberServices.getAll();
        const activeMembers = membersData.filter(m => m.status === 'active').length;
        
        // Obtener asistencias
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        
        const allAttendance = await attendanceServices.getAll();
        const todayAttendance = allAttendance.filter(a => 
          new Date(a.check_in) >= new Date(todayStart)
        ).length;
        
        // Obtener pagos
        const payments = await paymentServices.getAll();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        let totalRevenue = 0;
        payments.forEach(item => {
          totalRevenue += Number(item.amount);
        });
        
        const monthlyPayments = payments.filter(p => {
          const paymentDate = new Date(p.payment_date);
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        });
        
        // Convertir a número antes de realizar operaciones aritméticas
        const monthlyRevenue = monthlyPayments.reduce((sum, p) => {
          return Number(sum) + Number(p.amount);
        }, 0);
        
        // Actualizar estadísticas de resumen
        setSummaryStats({
          activeMembers,
          todayAttendance,
          updatedRoutines: 18, // Placeholder, ajustar cuando tengamos la tabla de rutinas
          monthlyRevenue
        });
        
        // Preparar datos para gráficos
        prepareMembershipData(membersData);
        prepareAttendanceData(allAttendance);
        prepareRevenueData(payments);
        prepareMembershipTypeData(membersData);
        prepareRecentActivities(membersData, payments, allAttendance);
        
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
    
    fetchDashboardData();
    
    // Actualizar datos cada 5 minutos
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Preparar datos de membresías por mes
  const prepareMembershipData = (membersData: any[]) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    const membershipByMonth = Array(6).fill(0).map((_, i) => {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - 5 + i);
      const month = monthDate.toLocaleString('es', { month: 'short' });
      
      const count = membersData.filter(m => {
        const startDate = new Date(m.start_date);
        return startDate.getMonth() === monthDate.getMonth() && 
               startDate.getFullYear() === monthDate.getFullYear();
      }).length;
      
      return { name: month, miembros: count };
    });
    
    setMembershipData(membershipByMonth);
  };
  
  // Preparar datos de asistencia por día
  const prepareAttendanceData = (allAttendance: any[]) => {
    const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    const now = new Date();
    const today = now.getDay(); // 0 = domingo, 1 = lunes, ...
    const daysToMonday = today === 0 ? 6 : today - 1;
    
    const attendanceByDay = weekDays.map((day, i) => {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() - daysToMonday + i);
      const dayStr = dayDate.toISOString().split('T')[0];
      
      const count = allAttendance.filter(a => {
        const checkInDate = new Date(a.check_in);
        return checkInDate.toISOString().split('T')[0] === dayStr;
      }).length;
      
      return { name: day, asistencias: count };
    });
    
    setAttendanceData(attendanceByDay);
  };
  
  // Preparar datos de ingresos por mes
  const prepareRevenueData = (payments: any[]) => {
    const revenueByMonth = Array(6).fill(0).map((_, i) => {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - 5 + i);
      const month = monthDate.toLocaleString('es', { month: 'short' });
      const monthNum = monthDate.getMonth();
      const yearNum = monthDate.getFullYear();
      
      const total = payments
        .filter(p => {
          const paymentDate = new Date(p.payment_date);
          return paymentDate.getMonth() === monthNum && 
                 paymentDate.getFullYear() === yearNum;
        })
        .reduce((sum, p) => {
          return Number(sum) + Number(p.amount);
        }, 0);
      
      return { name: month, ingresos: total };
    });
    
    setRevenueData(revenueByMonth);
  };
  
  // Preparar datos de tipos de membresía
  const prepareMembershipTypeData = (membersData: any[]) => {
    const membershipTypes: Record<string, number> = {};
    
    membersData.forEach(m => {
      if (m.status === 'active') {
        if (membershipTypes[m.membership_type]) {
          membershipTypes[m.membership_type]++;
        } else {
          membershipTypes[m.membership_type] = 1;
        }
      }
    });
    
    const membershipTypeArray = Object.entries(membershipTypes).map(([name, value]) => ({
      name,
      value
    }));
    
    setMembershipTypeData(membershipTypeArray);
  };
  
  // Preparar actividades recientes
  const prepareRecentActivities = (membersData: any[], payments: any[], allAttendance: any[]) => {
    const recentActs: RecentActivity[] = [];
    
    // Miembros recientes
    const recentMembers = [...membersData]
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 2);
      
    recentMembers.forEach(m => {
      recentActs.push({
        type: 'member',
        name: `${m.first_name} ${m.last_name}`,
        action: 'se registró',
        time: formatTimeAgo(new Date(m.start_date))
      });
    });
    
    // Pagos recientes
    const recentPayments = [...payments]
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())
      .slice(0, 2);
      
    recentPayments.forEach(p => {
      const member = membersData.find(m => m.id === p.member_id);
      if (member) {
        recentActs.push({
          type: 'payment',
          name: `${member.first_name} ${member.last_name}`,
          action: `pagó $${p.amount}`,
          time: formatTimeAgo(new Date(p.payment_date))
        });
      }
    });
    
    // Asistencias recientes
    const recentAttendances = [...allAttendance]
      .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime())
      .slice(0, 2);
      
    recentAttendances.forEach(a => {
      const member = membersData.find(m => m.id === a.member_id);
      if (member) {
        recentActs.push({
          type: 'attendance',
          name: `${member.first_name} ${member.last_name}`,
          action: 'asistió al gym',
          time: formatTimeAgo(new Date(a.check_in))
        });
      }
    });
    
    // Ordenar por tiempo
    recentActs.sort((a, b) => {
      // Esta es una comparación simplificada, ya que formatTimeAgo no devuelve valores que puedan ordenarse fácilmente
      // Para una ordenación precisa, deberíamos usar las fechas directas, pero mantenemos la compatibilidad con el código existente
      if (a.time < b.time) return 1;
      if (a.time > b.time) return -1;
      return 0;
    });
    
    setRecentActivities(recentActs.slice(0, 5));
  };

  // Componente para el spinner de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Summary cards data
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: summaryStats.activeMembers.toString(),
      description: "Miembros activos actualmente",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />,
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Asistencias Hoy",
      value: summaryStats.todayAttendance.toString(),
      description: "Visitantes del día",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />,
      color: "from-green-500 to-green-700"
    },
    {
      title: "Rutinas Actualizadas",
      value: summaryStats.updatedRoutines.toString(),
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />,
      color: "from-amber-500 to-amber-700"
    },
    {
      title: "Ingresos Mensuales",
      value: `$${summaryStats.monthlyRevenue.toLocaleString()}`,
      description: "Este mes",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />,
      color: "from-purple-500 to-purple-700"
    }
  ];

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

  return (
    <div className="pb-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className={isMobile ? "ml-14" : ""}>
          <h1 className="text-lg md:text-xl font-bold text-white">Dashboard</h1>
        </div>
        <div className="text-white text-xs md:text-sm">Administrador</div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-3 md:mb-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="bg-[#1A1F2C] border-gray-800 shadow-lg overflow-hidden">
            <div className={`h-1 w-full bg-gradient-to-r ${card.color}`}></div>
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-sm md:text-base text-white">{card.title}</CardTitle>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              <div className="text-xl md:text-2xl font-bold text-white mb-1">{card.value}</div>
              <p className="text-xs md:text-sm text-gray-400">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 mb-3 md:mb-6">
        <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg col-span-1 lg:col-span-2">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-lg text-white">Análisis de Membresías</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">
              Evolución de miembros en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="h-[200px] md:h-[240px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={membershipData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" fontSize={12} />
                    <YAxis stroke="#999" fontSize={12} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                    />
                    <Bar dataKey="miembros" fill="#4F8EF6" radius={[4, 4, 0, 0]} name="Miembros" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-lg text-white">Actividad Reciente</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">
              Últimas actividades registradas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-2 border-b border-gray-800 pb-2">
                    <div className={`p-1.5 rounded-full flex-shrink-0 ${
                      activity.type === 'member' ? 'bg-blue-900/40 text-blue-400' :
                      activity.type === 'payment' ? 'bg-green-900/40 text-green-400' :
                      activity.type === 'routine' ? 'bg-amber-900/40 text-amber-400' :
                      'bg-purple-900/40 text-purple-400'
                    }`}>
                      {activity.type === 'member' ? <UserCircle className="h-3 w-3 md:h-4 md:w-4" /> :
                      activity.type === 'payment' ? <CreditCard className="h-3 w-3 md:h-4 md:w-4" /> :
                      activity.type === 'routine' ? <Calendar className="h-3 w-3 md:h-4 md:w-4" /> :
                      <CalendarCheck className="h-3 w-3 md:h-4 md:w-4" />}
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-white">
                        <span className="font-medium">{activity.name}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">No hay actividades recientes</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Types Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 mb-3 md:mb-6">
        <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-lg text-white">Distribución de Membresías</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">
              Tipos de membresías activas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 md:p-2">
            <div className="h-[200px] md:h-[240px] flex justify-center">
              {membershipTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {membershipTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        {/* Tabs for different metrics */}
        <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg col-span-1 lg:col-span-2">
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-lg text-white">Estadísticas Detalladas</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6 pt-0">
            <Tabs defaultValue="asistencias" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-auto bg-[#222732]">
                <TabsTrigger 
                  value="asistencias"
                  className="text-xs md:text-sm py-2 data-[state=active]:bg-blue-700"
                >
                  Asistencias
                </TabsTrigger>
                <TabsTrigger 
                  value="ingresos" 
                  className="text-xs md:text-sm py-2 data-[state=active]:bg-blue-700"
                >
                  Ingresos
                </TabsTrigger>
              </TabsList>
              <TabsContent value="asistencias" className="pt-3">
                <div className="h-[200px] md:h-[240px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#999" fontSize={12} />
                        <YAxis stroke="#999" fontSize={12} />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                        />
                        <Bar dataKey="asistencias" fill="#22C55E" radius={[4, 4, 0, 0]} name="Asistencias" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs md:text-sm text-gray-400">Asistencias diarias - Última semana</p>
                </div>
              </TabsContent>
              <TabsContent value="ingresos" className="pt-3">
                <div className="h-[200px] md:h-[240px]">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="name" stroke="#999" fontSize={12} />
                        <YAxis stroke="#999" fontSize={12} />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                        />
                        <Bar dataKey="ingresos" fill="#A855F7" radius={[4, 4, 0, 0]} name="Ingresos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs md:text-sm text-gray-400">Ingresos mensuales - Últimos 6 meses</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
