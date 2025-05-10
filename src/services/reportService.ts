
import { supabase } from './baseService';

class ReportService {
  async getMembershipStats() {
    const { data, error } = await supabase
      .from('members')
      .select('membership_type, count:count(membership_type)', { head: true });
    
    if (error) throw error;
    return data;
  }

  async getAttendanceStats(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('attendance')
      .select('check_in')
      .gte('check_in', startDate)
      .lte('check_in', endDate);
    
    if (error) throw error;
    return data;
  }

  async getRevenueStats(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, payment_date')
      .gte('payment_date', startDate)
      .lte('payment_date', endDate);
    
    if (error) throw error;
    return data;
  }
}

export const reportServices = new ReportService();
