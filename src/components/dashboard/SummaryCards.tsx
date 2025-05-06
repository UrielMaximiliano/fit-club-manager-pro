
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, CalendarCheck, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SummaryStats {
  activeMembers: number;
  todayAttendance: number;
  updatedRoutines: number;
  monthlyRevenue: number;
}

interface SummaryCardsProps {
  stats: SummaryStats;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  // Summary cards data
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: stats.activeMembers.toString(),
      description: "Miembros activos actualmente",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />,
      color: "from-blue-500 to-blue-700",
      action: () => console.log("Ver detalles de miembros activos")
    },
    {
      title: "Asistencias Hoy",
      value: stats.todayAttendance.toString(),
      description: "Visitantes del día",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />,
      color: "from-green-500 to-green-700",
      action: () => console.log("Ver detalles de asistencias de hoy")
    },
    {
      title: "Rutinas Actualizadas",
      value: stats.updatedRoutines.toString(),
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />,
      color: "from-amber-500 to-amber-700",
      action: () => console.log("Ver rutinas actualizadas")
    },
    {
      title: "Ingresos Mensuales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      description: "Este mes",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />,
      color: "from-purple-500 to-purple-700",
      action: () => console.log("Ver detalles de ingresos mensuales")
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-3 md:mb-6">
      {summaryCards.map((card, index) => (
        <Card key={index} className="bg-[#1A1F2C] border-gray-800 shadow-lg overflow-hidden hover:bg-[#202736] transition-colors">
          <div className={`h-1 w-full bg-gradient-to-r ${card.color}`}></div>
          <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-sm md:text-base text-white">{card.title}</CardTitle>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
            <div className="text-xl md:text-2xl font-bold text-white mb-1">{card.value}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs md:text-sm text-gray-400">{card.description}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-gray-400 hover:text-white p-0 h-auto"
                onClick={card.action}
              >
                Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
