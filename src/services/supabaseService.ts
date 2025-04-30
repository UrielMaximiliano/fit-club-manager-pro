import { supabase } from '@/lib/supabase';

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

// Servicios para Miembros
export const memberServices = {
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