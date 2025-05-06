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
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Membership, membershipServices } from '@/services/supabaseService';

export default function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration_days: 30,
  });

  const loadMemberships = async () => {
    try {
      const data = await membershipServices.getAll();
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
    loadMemberships();

    // Configurar suscripción en tiempo real
    const unsubscribe = membershipServices.onDataChange((data) => {
      setMemberships(data);
      toast({
        title: 'Actualización',
        description: 'Los datos de membresías se han actualizado',
      });
    });
    
    // Limpiar suscripción al desmontar
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedMembership) {
        await membershipServices.update(selectedMembership.id, formData);
        toast({
          title: 'Éxito',
          description: 'Membresía actualizada correctamente',
        });
      } else {
        await membershipServices.create(formData);
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

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta membresía?')) {
      try {
        await membershipServices.delete(id);
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
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration_days: 30,
    });
    setSelectedMembership(null);
  };

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Membresías</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Membresía
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedMembership ? 'Editar Membresía' : 'Nueva Membresía'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <Input
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Precio
                </label>
                <Input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duración (días)
                </label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={formData.duration_days}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_days: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                {selectedMembership ? 'Actualizar' : 'Crear'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((membership) => (
                <TableRow key={membership.id}>
                  <TableCell>{membership.name}</TableCell>
                  <TableCell>{membership.description}</TableCell>
                  <TableCell>${membership.price.toFixed(2)}</TableCell>
                  <TableCell>{membership.duration_days} días</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(membership)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(membership.id)}
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
