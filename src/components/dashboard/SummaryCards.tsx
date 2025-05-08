import React from 'react';
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
  // Summary cards data
  const summaryCards = [
    {
      title: "Miembros Activos",
      value: stats.activeMembers.toString(),
      description: "Miembros activos actualmente",
      icon: <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />,
      color: "from-blue-500 to-blue-700",
      action: () => navigate('/members'),
      tooltip: "Ver todos los miembros"
    },
    {
      title: "Asistencias Hoy",
      value: stats.todayAttendance.toString(),
      description: "Visitantes del día",
      icon: <CalendarCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />,
      color: "from-green-500 to-green-700",
      action: () => navigate('/attendance'),
      tooltip: "Ver asistencias del día"
    },
    {
      title: "Rutinas Actualizadas",
      value: stats.updatedRoutines.toString(),
      description: "Esta semana",
      icon: <Calendar className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />,
      color: "from-amber-500 to-amber-700",
      action: () => navigate('/routines'),
      tooltip: "Ver rutinas"
    },
    {
      title: "Ingresos Mensuales",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      description: "Este mes",
      icon: <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />,
      color: "from-purple-500 to-purple-700",
      action: () => navigate('/payments'),
      tooltip: "Ver ingresos"
    }
  ];

  return (
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
  );
};

export default SummaryCards;
