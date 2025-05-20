// Shared type definitions for all services
export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  membership_type: string;
  start_date: string;
  end_date: string;
  tenant_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Membership {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  price: number;
  duration_days: number;
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_type: string;
  membership_id: string;
  tenant_id: string;
}

export interface Attendance {
  id: string;
  member_id: string;
  check_in: string;
  check_out?: string;
  tenant_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CashboxTransaction {
  id: string;
  date: string;
  concept: string;
  type: 'Ingreso' | 'Gasto' | 'Cierre';
  amount: number;
  tenant_id: string;
}

// Tipo para listeners de cambios en datos
export type DataChangeListener<T> = (data: T[]) => void;
