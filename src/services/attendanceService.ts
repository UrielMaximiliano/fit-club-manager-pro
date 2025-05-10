
import { BaseService, notifyListeners, supabase } from './baseService';
import { Attendance } from './types';

class AttendanceService extends BaseService<Attendance> {
  constructor() {
    super('attendance');
  }

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
  }

  async checkIn(member_id: string) {
    const { data, error } = await supabase
      .from('attendance')
      .insert([{
        member_id,
        check_in: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
    return data[0];
  }

  async checkOut(id: string) {
    const { data, error } = await supabase
      .from('attendance')
      .update({ check_out: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
    return data[0];
  }
}

export const attendanceServices = new AttendanceService();
