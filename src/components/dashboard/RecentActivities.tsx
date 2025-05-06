
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle, CalendarCheck, Calendar, CreditCard } from 'lucide-react';

interface RecentActivity {
  type: 'member' | 'payment' | 'attendance' | 'routine';
  name: string;
  action: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
      <CardHeader className="p-3 md:p-6">
        <CardTitle className="text-sm md:text-lg text-white">Actividad Reciente</CardTitle>
        <CardDescription className="text-xs md:text-sm text-gray-400">
          Últimas actividades registradas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-6 pt-0 md:pt-0">
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
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
