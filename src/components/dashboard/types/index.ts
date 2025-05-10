
// Common interface definitions for Dashboard components

export interface AttendanceData {
  day: string;
  asistencias: number;
}

export interface RevenueData {
  payment_date: string;
  amount: number;
}

export interface MembershipData {
  name: string;
  miembros: number;
}

export interface MembershipTypeData {
  name: string;
  value: number;
}

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface SummaryStats {
  activeMembers: number;
  todayAttendance: number;
  updatedRoutines: number;
  monthlyRevenue: number;
}
