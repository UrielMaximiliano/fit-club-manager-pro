
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, CalendarCheck, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const navigate = useNavigate();
  
  // Mantener el estado anterior para animaciones de transición
  const [prevStats, setPrevStats] = useState<SummaryStats>(stats);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Detectar cambios en las estadísticas para activar animaciones
  useEffect(() => {
    if (JSON.stringify(prevStats) !== JSON.stringify(stats)) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevStats(stats);
      }, 600); // Duración de la animación
      return () => clearTimeout(timer);
    }
  }, [stats, prevStats]);

  // Summary cards data con colores actualizados
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: stats.activeMembers.toString(),
      previousValue: prevStats.activeMembers.toString(),
      description: "Miembros activos actualmente",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-[#4ECDC4]" />,
      color: "from-[#4ECDC4] to-[#5DADE2]",
      bgColor: "bg-gradient-to-br from-[#F9FFFE] to-[#F0F9F9] dark:from-[#1E3635] dark:to-[#1A2F30]",
      iconBg: "bg-[#E7F8F7] dark:bg-[#1A3432]",
      textColor: "text-[#1B5954] dark:text-[#7BDDDA]",
      action: () => navigate('/members'),
      tooltip: "Ver todos los miembros"
    },
    {
      title: "Asistencias Hoy",
      value: stats.todayAttendance.toString(),
      previousValue: prevStats.todayAttendance.toString(),
      description: "Visitantes del día",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-[#5DADE2]" />,
      color: "from-[#5DADE2] to-[#7FB3D5]",
      bgColor: "bg-gradient-to-br from-[#F5F9FD] to-[#EDF7FC] dark:from-[#1E2C35] dark:to-[#1A2730]",
      iconBg: "bg-[#EEF7FC] dark:bg-[#1A2E3E]",
      textColor: "text-[#2471A3] dark:text-[#7FB3D5]",
      action: () => navigate('/attendance'),
      tooltip: "Ver asistencias del día"
    },
    {
      title: "Rutinas Actualizadas",
      value: stats.updatedRoutines.toString(),
      previousValue: prevStats.updatedRoutines.toString(),
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-[#7DCEA0]" />,
      color: "from-[#7DCEA0] to-[#82E0AA]",
      bgColor: "bg-gradient-to-br from-[#F9FCFA] to-[#F0F9F2] dark:from-[#1E3525] dark:to-[#1A3020]",
      iconBg: "bg-[#EDF8F3] dark:bg-[#1A3426]",
      textColor: "text-[#27AE60] dark:text-[#82E0AA]",
      action: () => navigate('/routines'),
      tooltip: "Ver rutinas"
    },
    {
      title: "Ingresos Mensuales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      previousValue: `$${prevStats.monthlyRevenue.toLocaleString()}`,
      description: "Este mes",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-[#9F9EA1]" />,
      color: "from-[#9F9EA1] to-[#C8C8C9]",
      bgColor: "bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F6] dark:from-[#2A2A2C] dark:to-[#252527]",
      iconBg: "bg-[#F5F5F5] dark:bg-[#2A2A2C]",
      textColor: "text-[#5A5A5C] dark:text-[#C8C8C9]",
      action: () => navigate('/payments'),
      tooltip: "Ver ingresos"
    }
  ];

  // Clase para la animación del valor cuando cambia
  const getValueClass = (index: number) => {
    const baseClass = "text-base sm:text-lg md:text-xl font-bold mb-2 transition-all duration-300 ease-in-out";
    if (isAnimating && prevStats[Object.keys(prevStats)[index] as keyof SummaryStats] !== 
        stats[Object.keys(stats)[index] as keyof SummaryStats]) {
      return `${baseClass} transform scale-110`;
    }
    return baseClass;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <Card 
            key={index} 
            className={`border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[170px] ${card.bgColor}`}
          >
            <div className={`h-1.5 w-full bg-gradient-to-r ${card.color}`}></div>
            <CardHeader className="p-4 pb-1 flex-nowrap">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm sm:text-base text-text font-semibold">{card.title}</CardTitle>
                <div className={`rounded-full p-2 ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex flex-col flex-1 justify-between">
              <div className={`${card.textColor} ${getValueClass(index)}`}>{card.value}</div>
              <div className="flex justify-between items-center mt-auto">
                <p className="text-xs sm:text-sm text-textSecondary truncate mr-2">{card.description}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`text-xs sm:text-sm hover:bg-opacity-10 p-0 h-auto whitespace-nowrap ${card.textColor} hover:${card.textColor}`}
                      onClick={card.action}
                    >
                      Detalles
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card border border-border shadow-md">
                    {card.tooltip}
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SummaryCards;
