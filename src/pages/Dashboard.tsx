
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarCheck, UserCircle, Calendar, CreditCard } from 'lucide-react';

// Mock data for dashboard
const membershipData = [
  { name: 'Ene', miembros: 65 },
  { name: 'Feb', miembros: 75 },
  { name: 'Mar', miembros: 90 },
  { name: 'Abr', miembros: 105 },
  { name: 'May', miembros: 120 },
  { name: 'Jun', miembros: 125 },
];

const attendanceData = [
  { name: 'Lun', asistencias: 42 },
  { name: 'Mar', asistencias: 53 },
  { name: 'Mie', asistencias: 48 },
  { name: 'Jue', asistencias: 65 },
  { name: 'Vie', asistencias: 70 },
  { name: 'Sab', asistencias: 40 },
  { name: 'Dom', asistencias: 20 },
];

const revenueData = [
  { name: 'Ene', ingresos: 3200 },
  { name: 'Feb', ingresos: 3800 },
  { name: 'Mar', ingresos: 4500 },
  { name: 'Abr', ingresos: 5100 },
  { name: 'May', ingresos: 5800 },
  { name: 'Jun', ingresos: 6000 },
];

const Dashboard = () => {
  const isMobile = useIsMobile();

  // Recent activities mock data
  const recentActivities = [
    { type: 'member', name: 'Laura Martínez', action: 'se registró', time: 'Hace 2 horas' },
    { type: 'payment', name: 'Carlos Rodríguez', action: 'renovó membresía Premium', time: 'Hace 3 horas' },
    { type: 'routine', name: 'Sofia López', action: 'completó su rutina', time: 'Hace 4 horas' },
    { type: 'attendance', name: 'Miguel Ángel', action: 'asistió al gym', time: 'Hace 5 horas' },
    { type: 'payment', name: 'Ana García', action: 'pagó su mensualidad', time: 'Hace 8 horas' },
  ];

  // Summary cards data
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: "125",
      description: "12 nuevos este mes",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />,
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Asistencias Hoy",
      value: "48",
      description: "15% más que ayer",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />,
      color: "from-green-500 to-green-700"
    },
    {
      title: "Rutinas Actualizadas",
      value: "18",
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />,
      color: "from-amber-500 to-amber-700"
    },
    {
      title: "Ingresos Mensuales",
      value: "$6,200",
      description: "8% más que el mes pasado",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />,
      color: "from-purple-500 to-purple-700"
    }
  ];

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
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={membershipData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#999" fontSize={12} />
                  <YAxis stroke="#999" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#222732', border: '1px solid #333' }}
                    labelStyle={{ color: 'white' }}
                    itemStyle={{ color: '#4F8EF6' }}
                  />
                  <Bar dataKey="miembros" fill="#4F8EF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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
              {recentActivities.map((activity, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different metrics */}
      <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" fontSize={12} />
                    <YAxis stroke="#999" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#222732', border: '1px solid #333' }}
                      labelStyle={{ color: 'white' }}
                      itemStyle={{ color: '#22C55E' }}
                    />
                    <Bar dataKey="asistencias" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs md:text-sm text-gray-400">Asistencias diarias - Última semana</p>
              </div>
            </TabsContent>
            <TabsContent value="ingresos" className="pt-3">
              <div className="h-[200px] md:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#999" fontSize={12} />
                    <YAxis stroke="#999" fontSize={12} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#222732', border: '1px solid #333' }}
                      labelStyle={{ color: 'white' }}
                      itemStyle={{ color: '#A855F7' }}
                      formatter={(value) => [`$${value}`, 'Ingresos']}
                    />
                    <Bar dataKey="ingresos" fill="#A855F7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs md:text-sm text-gray-400">Ingresos mensuales - Últimos 6 meses</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
