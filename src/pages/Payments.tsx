import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useToast } from '../hooks/use-toast';

// Tipado para el pago local
type Payment = {
  id: string;
  member_id: string;
  membership_id: string;
  amount: number;
  payment_type: string;
  payment_date: string;
};

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [form, setForm] = useState({
    amount: '',
    payment_type: 'Efectivo',
    payment_date: new Date().toISOString().slice(0, 10),
  });
  const [manualMember, setManualMember] = useState('');
  const [manualMembership, setManualMembership] = useState('');
  const [password, setPassword] = useState('');
  const SECURITY_PASSWORD = 'admin123';

  // Cargar pagos desde localStorage al iniciar
  useEffect(() => {
    const pagosGuardados = localStorage.getItem('pagos_local');
    if (pagosGuardados) {
      setPayments(JSON.parse(pagosGuardados));
    }
  }, []);

  // Guardar pagos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem('pagos_local', JSON.stringify(payments));
  }, [payments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== SECURITY_PASSWORD) {
      toast({ title: 'Error', description: 'Contraseña incorrecta.', variant: 'destructive' });
      return;
    }
    if (!manualMember || !manualMembership || !form.amount || !form.payment_type || !form.payment_date) {
      toast({ title: 'Error', description: 'Completa todos los campos', variant: 'destructive' });
      return;
    }
    setPayments(prev => [
      {
        id: Date.now().toString(),
        member_id: manualMember,
        membership_id: manualMembership,
        amount: Number(form.amount),
        payment_type: form.payment_type,
        payment_date: form.payment_date,
      },
      ...prev,
    ]);
    toast({ title: 'Éxito', description: 'Pago registrado correctamente' });
    setForm({ amount: '', payment_type: 'Efectivo', payment_date: new Date().toISOString().slice(0, 10) });
    setManualMember('');
    setManualMembership('');
    setPassword('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pagos</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#232329] p-4 rounded-xl max-w-xl mx-auto mb-8">
        <div>
          <label className="block mb-1 text-gray-100">Miembro</label>
          <Input
            placeholder="Nombre del miembro"
            value={manualMember}
            onChange={e => setManualMember(e.target.value)}
            className="bg-[#222732] text-gray-100 border border-gray-700 rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-100">Membresía</label>
          <Input
            placeholder="Nombre de la membresía"
            value={manualMembership}
            onChange={e => setManualMembership(e.target.value)}
            className="bg-[#222732] text-gray-100 border border-gray-700 rounded-lg"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 text-gray-100">Monto</label>
            <Input type="number" min="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="bg-[#222732] text-gray-100 border border-gray-700 rounded-lg" required />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-gray-100">Tipo</label>
            <Select value={form.payment_type} onValueChange={v => setForm(f => ({ ...f, payment_type: v }))} required>
              <SelectTrigger className="bg-[#222732] text-gray-100 border border-gray-700 rounded-lg">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Efectivo">Efectivo</SelectItem>
                <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                <SelectItem value="Transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-100">Fecha</label>
          <Input type="date" value={form.payment_date} onChange={e => setForm(f => ({ ...f, payment_date: e.target.value }))} className="bg-[#222732] text-gray-100 border border-gray-700 rounded-lg" required />
        </div>
        <div>
          <label className="block mb-1 text-gray-100">Contraseña de seguridad</label>
          <Input
            type="password"
            placeholder="Ingresa la contraseña para confirmar"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="bg-[#222732] text-gray-100 border border-gray-700 rounded-lg"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-accent text-white font-bold rounded-lg py-2 mt-2 hover:bg-accent2 transition">Registrar Pago</Button>
      </form>
      <h2 className="text-xl font-bold mb-2">Pagos registrados</h2>
      {payments.length === 0 ? (
        <div className="text-center text-secondary py-12">No hay pagos registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#232329] text-gray-100 rounded-xl">
            <thead>
              <tr>
                <th className="px-4 py-2">Miembro</th>
                <th className="px-4 py-2">Membresía</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Tipo</th>
                <th className="px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p.id || i}>
                  <td className="px-4 py-2">{p.member_id}</td>
                  <td className="px-4 py-2">{p.membership_id}</td>
                  <td className="px-4 py-2">${Number(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{p.payment_type}</td>
                  <td className="px-4 py-2">{new Date(p.payment_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
