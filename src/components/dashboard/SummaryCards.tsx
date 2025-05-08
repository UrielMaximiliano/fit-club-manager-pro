<<<<<<< HEAD
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
=======

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
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
<<<<<<< HEAD
  const navigate = useNavigate();
=======
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

>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
  // Summary cards data
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: stats.activeMembers.toString(),
      previousValue: prevStats.activeMembers.toString(),
      description: "Miembros activos actualmente",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />,
      color: "from-blue-500 to-blue-700",
<<<<<<< HEAD
      action: () => navigate('/members'),
      tooltip: "Ver todos los miembros"
=======
      colorClass: "bg-blue-500",
      action: () => console.log("Ver detalles de miembros activos")
>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
    },
    {
      title: "Asistencias Hoy",
      value: stats.todayAttendance.toString(),
      previousValue: prevStats.todayAttendance.toString(),
      description: "Visitantes del día",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />,
      color: "from-green-500 to-green-700",
<<<<<<< HEAD
      action: () => navigate('/attendance'),
      tooltip: "Ver asistencias del día"
=======
      colorClass: "bg-green-500",
      action: () => console.log("Ver detalles de asistencias de hoy")
>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
    },
    {
      title: "Rutinas Actualizadas",
      value: stats.updatedRoutines.toString(),
      previousValue: prevStats.updatedRoutines.toString(),
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />,
      color: "from-amber-500 to-amber-700",
<<<<<<< HEAD
      action: () => navigate('/routines'),
      tooltip: "Ver rutinas"
=======
      colorClass: "bg-amber-500",
      action: () => console.log("Ver rutinas actualizadas")
>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
    },
    {
      title: "Ingresos Mensuales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      previousValue: `$${prevStats.monthlyRevenue.toLocaleString()}`,
      description: "Este mes",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />,
      color: "from-purple-500 to-purple-700",
<<<<<<< HEAD
      action: () => navigate('/payments'),
      tooltip: "Ver ingresos"
=======
      colorClass: "bg-purple-500",
      action: () => console.log("Ver detalles de ingresos mensuales")
>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
    }
  ];

  return (
<<<<<<< HEAD
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <Card key={index} className="bg-card border border-border shadow-lg overflow-hidden hover:bg-blue-50 transition-colors flex flex-col justify-between min-h-[170px]">
            <div className={`h-1.5 w-full bg-gradient-to-r ${card.color}`}></div>
            <CardHeader className="p-4 pb-1 flex-nowrap">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm sm:text-base text-text">{card.title}</CardTitle>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex flex-col flex-1 justify-between">
              <div className="text-base sm:text-lg md:text-xl font-bold text-text mb-2">{card.value}</div>
              <div className="flex justify-between items-center mt-auto">
                <p className="text-xs sm:text-sm text-textSecondary truncate mr-2">{card.description}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs sm:text-sm text-accent hover:text-white p-0 h-auto whitespace-nowrap"
                      onClick={card.action}
                    >
                      Detalles
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{card.tooltip}</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
=======
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaryCards.map((card, index) => (
        <Card key={index} className="bg-white dark:bg-[#1A1F2C] border-gray-200 dark:border-gray-800 shadow overflow-hidden">
          <div className={`h-1.5 w-full ${card.colorClass}`}></div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-base font-medium text-gray-700 dark:text-white">{card.title}</h3>
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                {card.icon}
              </div>
            </div>
            <div className={`text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-all duration-500 ease-in-out ${
              isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
            }`}>
              {card.value}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate mr-2">{card.description}</p>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 p-0 h-auto whitespace-nowrap"
                onClick={card.action}
              >
                Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
>>>>>>> 5831785e39c0e348f274421330cd0c20518d7da4
  );
};

export default SummaryCards;
