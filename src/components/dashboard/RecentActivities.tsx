
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { UserCircle, CalendarCheck, Calendar, CreditCard, RefreshCw } from 'lucide-react';

interface RecentActivity {
  type: 'member' | 'payment' | 'attendance' | 'routine';
  name: string;
  action: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities: initialActivities }) => {
  const [activities, setActivities] = useState(initialActivities);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'member' | 'payment' | 'attendance' | 'routine'>('all');

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
      <CardHeader className="p-3 md:p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm md:text-lg text-white">Actividad Reciente</CardTitle>
            <CardDescription className="text-xs md:text-sm text-gray-400">
              Últimas actividades registradas
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <div className="px-3 md:px-6">
        <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2">
          <Button 
            size="sm" 
            variant={filter === 'all' ? "default" : "outline"} 
            className="text-xs md:text-sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'member' ? "default" : "outline"} 
            className="text-xs md:text-sm"
            onClick={() => setFilter('member')}
          >
            Miembros
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'payment' ? "default" : "outline"} 
            className="text-xs md:text-sm"
            onClick={() => setFilter('payment')}
          >
            Pagos
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'attendance' ? "default" : "outline"} 
            className="text-xs md:text-sm"
            onClick={() => setFilter('attendance')}
          >
            Asistencias
          </Button>
        </div>
      </div>
      <CardContent className="p-3 md:p-6 pt-2">
        <div className="space-y-3 max-h-[240px] overflow-y-auto scrollbar-thin">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, index) => (
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
  );
};

export default RecentActivities;
