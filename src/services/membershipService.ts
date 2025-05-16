import { BaseService, notifyListeners, supabase } from './baseService';
import { Membership } from './types';

class MembershipService extends BaseService<Membership> {
  constructor() {
    super('memberships');
  }

  async getAll(tenantId: string) {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('price', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async create(membership: Omit<Membership, 'id'>, tenantId: string) {
    const { data, error } = await supabase
      .from('memberships')
      .insert([{ ...membership, tenant_id: tenantId }])
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
    return data[0];
  }

  async update(id: string, updates: Partial<Membership>, tenantId: string) {
    const { data, error } = await supabase
      .from('memberships')
      .update(updates)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
    return data[0];
  }

  async delete(id: string, tenantId: string) {
    const { error } = await supabase
      .from('memberships')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
  }
}

export const membershipServices = new MembershipService();
