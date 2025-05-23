
// Utility functions for preparing dashboard data
import { formatTimeAgo } from './formatUtils';
import { 
  AttendanceData, 
  RevenueData, 
  MembershipData, 
  MembershipTypeData, 
  SummaryStats
} from '../types';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  start_date: string;
  membership_type: string;
}

interface Attendance {
  member_id: string;
  check_in: string;
}

interface Payment {
  member_id: string;
  amount: string | number;
  payment_date: string;
}

export interface RecentActivity {
  type: 'member' | 'payment' | 'attendance' | 'routine';
  name: string;
  action: string;
  time: string;
}

// Prepare membership data by month
export function prepareMembershipData(members: any[]): MembershipData[] {
  // Agrupa por tipo y cuenta miembros, asegurando enteros
  const grouped = members.reduce((acc, member) => {
    const type = member.membership_type || 'Sin tipo';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(grouped).map(([name, miembros]) => ({
    name,
    miembros: Math.round(Number(miembros)) // Asegura entero y tipo correcto
  }));
}

// Prepare attendance data by day
export const prepareAttendanceData = (allAttendance: Attendance[]): AttendanceData[] => {
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
    
    return { day, asistencias: count };
  });
  
  return attendanceByDay;
};

// Prepare revenue data by month
export const prepareRevenueData = (payments: Payment[]): RevenueData[] => {
  return payments.map(payment => ({
    payment_date: payment.payment_date,
    amount: Number(payment.amount)
  }));
};

// Prepare membership type data
export const prepareMembershipTypeData = (membersData: Member[]): MembershipTypeData[] => {
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
  
  return membershipTypeArray;
};

// Prepare recent activities
export const prepareRecentActivities = (
  membersData: Member[], 
  payments: Payment[], 
  allAttendance: Attendance[]
): RecentActivity[] => {
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
        action: `pagó $${Number(p.amount).toLocaleString()}`,
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
  
  return recentActs.slice(0, 5);
};

// Calculate summary statistics
export const calculateSummaryStats = (
  membersData: Member[], // Keep this for now as other functions in this file might use it, or it's used by other stats.
  allAttendance: Attendance[],
  payments: Payment[],
  activeMembersCount: number // New parameter
): SummaryStats => {
  // const activeMembers = membersData.filter(m => m.status === 'active').length; // This line is now replaced by the parameter

  // Asistencias de hoy
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  
  const todayAttendance = allAttendance.filter(a => 
    new Date(a.check_in) >= new Date(todayStart)
  ).length;
  
  // Pagos del mes actual
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyPayments = payments.filter(p => {
    const paymentDate = new Date(p.payment_date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });
  
  // Calcular ingresos mensuales
  const monthlyRevenue = monthlyPayments.reduce((sum, p) => {
    return Number(sum) + Number(p.amount);
  }, 0);
  
  return {
    activeMembers: activeMembersCount, // Use the passed count
    todayAttendance,
    updatedRoutines: 18, // Placeholder, ajustar cuando tengamos la tabla de rutinas
    monthlyRevenue
  };
};
