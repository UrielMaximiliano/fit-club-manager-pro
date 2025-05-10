
import { BaseService, notifyListeners, supabase } from './baseService';
import { Member } from './types';

class MemberService extends BaseService<Member> {
  constructor() {
    super('members');
  }

  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async create(member: Omit<Member, 'id'>) {
    const { data, error } = await supabase
      .from('members')
      .insert([member])
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
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
}

export const memberServices = new MemberService();
