import { supabase } from '@/lib/supabase';
import { realtimeService, TableName } from './realtimeService';

// Tipos
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
}

export interface Membership {
  id: string;
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
}

export interface Attendance {
  id: string;
  member_id: string;
  check_in: string;
  check_out?: string;
}

export interface CashboxTransaction {
  id: string;
  date: string;
  concept: string;
  type: 'Ingreso' | 'Gasto' | 'Cierre';
  amount: number;
}

// Tipo para listeners de cambios en datos
export type DataChangeListener<T> = (data: T[]) => void;

// Mapa para almacenar listeners por tipo de tabla
const listeners = new Map<TableName, Set<DataChangeListener<any>>>();

// Función para notificar a los listeners cuando hay cambios
const notifyListeners = async (tableName: TableName) => {
  const listenerSet = listeners.get(tableName);
  if (!listenerSet || listenerSet.size === 0) return;

  try {
    // Recuperar datos actualizados
    let data;
    switch (tableName) {
      case 'members':
        data = await memberServices.getAll();
        break;
      case 'memberships':
        data = await membershipServices.getAll();
        break;
      case 'payments':
        data = await paymentServices.getAll();
        break;
      case 'attendance':
        data = await attendanceServices.getAll();
        break;
    }

    // Notificar a todos los listeners
    listenerSet.forEach(listener => listener(data));
  } catch (error) {
    console.error(`Error al recuperar datos actualizados de ${tableName}:`, error);
  }
};

// Configuración de suscripciones en tiempo real para cada tabla
const setupRealtimeSubscriptions = () => {
  const tables: TableName[] = ['members', 'memberships', 'payments', 'attendance'];
  
  tables.forEach(table => {
    realtimeService.subscribe(table, {
      onAny: () => notifyListeners(table)
    });
  });
};

// Iniciar suscripciones
setupRealtimeSubscriptions();

// Servicios para Miembros
export const memberServices = {
  // Registrar un listener para cambios en miembros
  onDataChange(listener: DataChangeListener<Member>) {
    let listenerSet = listeners.get('members');
    if (!listenerSet) {
      listenerSet = new Set();
      listeners.set('members', listenerSet);
    }
    listenerSet.add(listener);
    
    // Retornar función para eliminar el listener
    return () => {
      const set = listeners.get('members');
      if (set) set.delete(listener);
    };
  },

  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(member: Omit<Member, 'id'>) {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id: string, updates: Partial<Member>) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Servicios para Membresías
export const membershipServices = {
  // Registrar un listener para cambios en membresías
  onDataChange(listener: DataChangeListener<Membership>) {
    let listenerSet = listeners.get('memberships');
    if (!listenerSet) {
      listenerSet = new Set();
      listeners.set('memberships', listenerSet);
    }
    listenerSet.add(listener);
    
    // Retornar función para eliminar el listener
    return () => {
      const set = listeners.get('memberships');
      if (set) set.delete(listener);
    };
  },

  async getAll() {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(membership: Omit<Membership, 'id'>) {
    const { data, error } = await supabase
      .from('memberships')
      .insert([membership])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id: string, updates: Partial<Membership>) {
    const { data, error } = await supabase
      .from('memberships')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Servicios para Pagos
export const paymentServices = {
  // Registrar un listener para cambios en pagos
  onDataChange(listener: DataChangeListener<Payment>) {
    let listenerSet = listeners.get('payments');
    if (!listenerSet) {
      listenerSet = new Set();
      listeners.set('payments', listenerSet);
    }
    listenerSet.add(listener);
    
    // Retornar función para eliminar el listener
    return () => {
      const set = listeners.get('payments');
      if (set) set.delete(listener);
    };
  },

  async getAll() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        members (first_name, last_name),
        memberships (name)
      `)
      .order('payment_date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(payment: Omit<Payment, 'id'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// Servicios para Asistencias
export const attendanceServices = {
  // Registrar un listener para cambios en asistencias
  onDataChange(listener: DataChangeListener<Attendance>) {
    let listenerSet = listeners.get('attendance');
    if (!listenerSet) {
      listenerSet = new Set();
      listeners.set('attendance', listenerSet);
    }
    listenerSet.add(listener);
    
    // Retornar función para eliminar el listener
    return () => {
      const set = listeners.get('attendance');
      if (set) set.delete(listener);
    };
  },

  async getAll() {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        members (first_name, last_name)
      `)
      .order('check_in', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async checkIn(member_id: string) {
    const { data, error } = await supabase
      .from('attendance')
      .insert([{
        member_id,
        check_in: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async checkOut(id: string) {
    const { data, error } = await supabase
      .from('attendance')
      .update({ check_out: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  }
};

// Servicios para Reportes
export const reportServices = {
  async getMembershipStats() {
    const { data, error } = await supabase
      .from('members')
      .select('membership_type, count:count(membership_type)', { head: true });
    
    if (error) throw error;
    return data;
  },

  async getAttendanceStats(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('check_in')
      .gte('check_in', startDate)
      .lte('check_in', endDate);
    
    if (error) throw error;
    return data;
  },

  async getRevenueStats(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .gte('payment_date', startDate)
      .lte('payment_date', endDate);
    
    if (error) throw error;
    return data;
  }
};

export const cashboxServices = {
  async getAll() {
    const { data, error } = await supabase
      .from('cashbox')
      .select('*')
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(transaction: Omit<CashboxTransaction, 'id'>) {
    const { data, error } = await supabase
      .from('cashbox')
      .insert([transaction])
      .select();
    if (error) throw error;
    return data[0];
  },
  async delete(id: string) {
    const { error } = await supabase
      .from('cashbox')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}; 
