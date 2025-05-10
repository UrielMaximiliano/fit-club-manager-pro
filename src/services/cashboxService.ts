
import { supabase } from './baseService';
import { CashboxTransaction } from './types';

class CashboxService {
  async getAll() {
    const { data, error } = await supabase
      .from('cashbox')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(transaction: Omit<CashboxTransaction, 'id'>) {
    const { data, error } = await supabase
      .from('cashbox')
      .insert([transaction])
      .select();
    
    if (error) throw error;
    return data[0];
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('cashbox')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const cashboxServices = new CashboxService();
