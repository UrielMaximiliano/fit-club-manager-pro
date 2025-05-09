
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

  // Summary cards data
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: stats.activeMembers.toString(),
      previousValue: prevStats.activeMembers.toString(),
      description: "Miembros activos actualmente",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
      iconBg: "bg-blue-100 dark:bg-blue-700/30",
      textColor: "text-blue-700 dark:text-blue-300",
      action: () => navigate('/members'),
      tooltip: "Ver todos los miembros"
    },
    {
      title: "Asistencias Hoy",
      value: stats.todayAttendance.toString(),
      previousValue: prevStats.todayAttendance.toString(),
      description: "Visitantes del día",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />,
      color: "from-green-500 to-green-700",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
      iconBg: "bg-green-100 dark:bg-green-700/30",
      textColor: "text-green-700 dark:text-green-300",
      action: () => navigate('/attendance'),
      tooltip: "Ver asistencias del día"
    },
    {
      title: "Rutinas Actualizadas",
      value: stats.updatedRoutines.toString(),
      previousValue: prevStats.updatedRoutines.toString(),
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />,
      color: "from-amber-500 to-amber-700",
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
      iconBg: "bg-amber-100 dark:bg-amber-700/30",
      textColor: "text-amber-700 dark:text-amber-300",
      action: () => navigate('/routines'),
      tooltip: "Ver rutinas"
    },
    {
      title: "Ingresos Mensuales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      previousValue: `$${prevStats.monthlyRevenue.toLocaleString()}`,
      description: "Este mes",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
      iconBg: "bg-purple-100 dark:bg-purple-700/30",
      textColor: "text-purple-700 dark:text-purple-300",
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
