
// Common interface definitions for Dashboard components

export interface AttendanceData {
  name: string;
  asistencias: number;
}

export interface RevenueData {
  name: string;
  ingresos: number;
}

export interface MembershipData {
  name: string;
  activos: number;
  inactivos: number;
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
