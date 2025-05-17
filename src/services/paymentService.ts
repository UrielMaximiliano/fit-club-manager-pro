import { BaseService, notifyListeners, supabase } from './baseService';
import { Payment } from './types';

class PaymentService extends BaseService<Payment> {
  constructor() {
    super('payments');
  }

  async getAll(tenantId: string) {
    if (!tenantId) return [];
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        members (first_name, last_name),
        memberships (name)
      `)
      .eq('tenant_id', tenantId)
      .order('payment_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async create(payment: Omit<Payment, 'id'>, tenantId: string) {
    if (!tenantId) throw new Error('tenantId es requerido');
    const validatedPayment = {
      ...payment,
      amount: Number(payment.amount) || 0,
      tenant_id: tenantId,
    };
    const { data, error } = await supabase
      .from('payments')
      .insert([validatedPayment])
      .select();
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
    return data[0];
  }

  async update(id: string, payment: Partial<Omit<Payment, 'id'>>, tenantId: string) {
    if (!tenantId) throw new Error('tenantId es requerido');
    const { data, error } = await supabase
      .from('payments')
      .update(payment)
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .select();
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
    return data?.[0];
  }

  async delete(id: string, tenantId: string) {
    if (!tenantId) throw new Error('tenantId es requerido');
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw error;
    notifyListeners(this.tableName, () => this.getAll(tenantId));
    return true;
  }
}

export const paymentServices = new PaymentService();
