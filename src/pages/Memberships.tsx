// -----------------------------------------------------------------------------
// Página de gestión de Membresías (Memberships)
// Permite crear, editar, eliminar y listar membresías por tenant.
// Sigue principios SOLID y patrones de diseño, con comentarios en español.
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Membership, membershipServices } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Componente principal de la página de membresías
 */
export default function Memberships() {
  // Estado de membresías y formulario
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { tenantId, isDemo } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration_days: 30,
  });

  /**
   * Carga las membresías del tenant actual
   */
  const loadMemberships = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const data = await membershipServices.getAll(tenantId);
      setMemberships(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las membresías',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) loadMemberships();
    // eslint-disable-next-line
  }, [tenantId]);

  /**
   * Maneja el submit del formulario de membresía
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    try {
      if (selectedMembership) {
        await membershipServices.update(selectedMembership.id, { ...formData, tenant_id: tenantId }, tenantId);
        toast({
          title: 'Éxito',
          description: 'Membresía actualizada correctamente',
        });
      } else {
        await membershipServices.create({ ...formData, tenant_id: tenantId }, tenantId);
        toast({
          title: 'Éxito',
          description: 'Membresía creada correctamente',
        });
      }
      setIsDialogOpen(false);
      loadMemberships();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al procesar la operación',
        variant: 'destructive',
      });
    }
  };

  /**
   * Maneja la eliminación de una membresía
   */
  const handleDelete = async (id: string) => {
    if (isDemo) return;
    if (!tenantId) return;
    try {
      await membershipServices.delete(id, tenantId);
      toast({
        title: 'Éxito',
        description: 'Membresía eliminada correctamente',
      });
      loadMemberships();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la membresía',
        variant: 'destructive',
      });
    }
  };

  /**
   * Resetea el formulario y el estado de edición
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration_days: 30,
    });
    setSelectedMembership(null);
  };

  /**
   * Carga los datos de una membresía para editar
   */
  const handleEdit = (membership: Membership) => {
    setSelectedMembership(membership);
    setFormData({
      name: membership.name,
      description: membership.description,
      price: membership.price,
      duration_days: membership.duration_days,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#18181b] py-8 px-2 sm:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Membresías</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 flex items-center gap-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Membresía
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#232329] border border-gray-700 text-white rounded-xl">
            <DialogHeader>
              <DialogTitle>{selectedMembership ? 'Editar Membresía' : 'Nueva Membresía'}</DialogTitle>
              <DialogDescription className="text-gray-400">Completa los datos de la membresía y guarda los cambios.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Nombre</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#18181b] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Descripción</label>
                <Input
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-[#18181b] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Precio</label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="bg-[#18181b] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Duración (días)</label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                  className="bg-[#18181b] border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">{selectedMembership ? 'Actualizar' : 'Crear'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Banner modo demo */}
      {isDemo && (
        <div className="w-full bg-blue-900 text-blue-200 text-center py-2 rounded-lg mb-4 font-semibold">
          Estás en modo DEMO. Los cambios no afectan datos reales y las acciones destructivas están deshabilitadas.
        </div>
      )}
      {loading ? (
        <div className="text-center text-white">Cargando...</div>
      ) : (
        <div className="border border-gray-700 rounded-xl bg-[#232329] overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#18181b]">
              <TableRow>
                <TableHead className="text-gray-400 font-semibold">Nombre</TableHead>
                <TableHead className="text-gray-400 font-semibold">Descripción</TableHead>
                <TableHead className="text-gray-400 font-semibold">Precio</TableHead>
                <TableHead className="text-gray-400 font-semibold">Duración</TableHead>
                <TableHead className="text-gray-400 font-semibold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((membership) => (
                <TableRow key={membership.id} className="bg-[#232329] hover:bg-[#18181b] border-b border-gray-700 transition-all">
                  <TableCell className="text-white font-semibold">{membership.name}</TableCell>
                  <TableCell className="text-gray-200">{membership.description}</TableCell>
                  <TableCell className="text-blue-400 font-semibold">${membership.price.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">{membership.duration_days} días</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-blue-400"
                        onClick={() => handleEdit(membership)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-400"
                        onClick={() => !isDemo && handleDelete(membership.id)}
                        disabled={isDemo}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
