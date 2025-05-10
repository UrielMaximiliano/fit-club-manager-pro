
import { BaseService, notifyListeners, supabase } from './baseService';
import { Membership } from './types';

class MembershipService extends BaseService<Membership> {
  constructor() {
    super('memberships');
  }

  async getAll() {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async create(membership: Omit<Membership, 'id'>) {
    const { data, error } = await supabase
      .from('memberships')
      .insert([membership])
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
    return data[0];
  }

  async update(id: string, updates: Partial<Membership>) {
    const { data, error } = await supabase
      .from('memberships')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
    return data[0];
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
  }
}

export const membershipServices = new MembershipService();
