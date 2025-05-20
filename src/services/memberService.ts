import { BaseService, notifyListeners, supabase } from './baseService';
import { Member } from './types';

class MemberService extends BaseService<Member> {
  constructor() {
    super('members');
  }

  async getAll(tenantId?: string) {
    let query = supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });
    if (tenantId) {
      query = query.eq('tenant_id', tenantId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(member: Omit<Member, 'id'>, tenantId?: string) {
    const memberWithTenant = tenantId ? { ...member, tenant_id: tenantId } : member;
    const { data, error } = await supabase
      .from('members')
      .insert([memberWithTenant])
      .select();
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
    return data[0];
  }

  async update(id: string, updates: Partial<Member>) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
    return data[0];
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
  }

  async getActiveMembersCount(tenantId: string): Promise<number> {
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching active members count:', error);
      throw error; 
    }
    return count ?? 0;
  }
}

export const memberServices = new MemberService();
