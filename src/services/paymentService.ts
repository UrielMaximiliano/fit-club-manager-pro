
import { BaseService, notifyListeners, supabase } from './baseService';
import { Payment } from './types';

class PaymentService extends BaseService<Payment> {
  constructor() {
    super('payments');
  }

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
  }

  async create(payment: Omit<Payment, 'id'>) {
    // Aseguramos que amount es un número válido
    const validatedPayment = {
      ...payment,
      amount: Number(payment.amount) || 0
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([validatedPayment])
      .select();
    
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll());
    return data[0];
  }
}

export const paymentServices = new PaymentService();
