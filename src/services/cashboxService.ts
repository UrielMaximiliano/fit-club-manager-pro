import { supabase } from './baseService';
import { CashboxTransaction } from './types';

class CashboxService {
  async getAll(tenantId: string) {
    if (!tenantId) return [];
    const { data, error } = await supabase
      .from('cashbox')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(transaction: Omit<CashboxTransaction, 'id'>, tenantId: string) {
    if (!tenantId) throw new Error('tenantId es requerido');
    const { data, error } = await supabase
      .from('cashbox')
      .insert([{ ...transaction, tenant_id: tenantId }])
      .select();
    if (error) throw error;
    return data[0];
  }

  async delete(id: string, tenantId: string) {
    if (!tenantId) throw new Error('tenantId es requerido');
    const { error } = await supabase
      .from('cashbox')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw error;
  }
}

export const cashboxServices = new CashboxService();
