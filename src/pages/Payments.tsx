import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Member, Membership, Payment, memberServices, membershipServices, paymentServices } from '@/services/supabaseService';

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    member_id: '',
    membership_id: '',
    amount: 0,
    payment_type: 'efectivo',
    payment_date: new Date().toISOString().split('T')[0],
  });

  const loadData = async () => {
    try {
      const [paymentsData, membersData, membershipsData] = await Promise.all([
        paymentServices.getAll(),
        memberServices.getAll(),
        membershipServices.getAll(),
      ]);
      setPayments(paymentsData);
      setMembers(membersData);
      setMemberships(membershipsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Configurar suscripciones en tiempo real
    const unsubscribePayments = paymentServices.onDataChange((data) => {
      setPayments(data);
      toast({
        title: 'Actualización',
        description: 'Los datos de pagos se han actualizado',
      });
    });
    
    const unsubscribeMembers = memberServices.onDataChange((data) => {
      setMembers(data);
    });
    
    const unsubscribeMemberships = membershipServices.onDataChange((data) => {
      setMemberships(data);
    });
    
    // Limpiar suscripciones al desmontar
    return () => {
      unsubscribePayments();
      unsubscribeMembers();
      unsubscribeMemberships();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentServices.create(formData);
      toast({
        title: 'Éxito',
        description: 'Pago registrado correctamente',
      });
      setIsDialogOpen(false);
      loadData();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al procesar el pago',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      member_id: '',
      membership_id: '',
      amount: 0,
      payment_type: 'efectivo',
      payment_date: new Date().toISOString().split('T')[0],
    });
  };

  const filteredPayments = payments.filter((payment: any) => {
    const memberName = `${payment.members?.first_name} ${payment.members?.last_name}`.toLowerCase();
    return memberName.includes(searchTerm.toLowerCase());
  });

  const paymentTypes = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Miembro
                </label>
                <Select
                  value={formData.member_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, member_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Membresía
                </label>
                <Select
                  value={formData.membership_id}
                  onValueChange={(value) => {
                    const membership = memberships.find((m) => m.id === value);
                    setFormData({
                      ...formData,
                      membership_id: value,
                      amount: membership ? membership.price : 0,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar membresía" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberships.map((membership) => (
                      <SelectItem key={membership.id} value={membership.id}>
                        {membership.name} - ${membership.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Monto
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo de Pago
                </label>
                <Select
                  value={formData.payment_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, payment_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha
                </label>
                <Input
                  type="date"
                  required
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Registrar Pago
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar pagos por nombre de miembro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Miembro</TableHead>
                <TableHead>Membresía</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Tipo de Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {payment.members?.first_name} {payment.members?.last_name}
                  </TableCell>
                  <TableCell>{payment.memberships?.name}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {paymentTypes.find((t) => t.value === payment.payment_type)?.label}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
