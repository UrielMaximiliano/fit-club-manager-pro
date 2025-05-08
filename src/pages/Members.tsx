import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, UserPlus } from 'lucide-react';
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
import { Member, memberServices } from '@/services/supabaseService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    membership_type: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await memberServices.getAll();
      setMembers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los miembros',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedMember) {
        await memberServices.update(selectedMember.id, {
          ...formData,
          status: 'active',
        });
        toast({
          title: 'Éxito',
          description: 'Miembro actualizado correctamente',
        });
      } else {
        await memberServices.create({
          ...formData,
          status: 'active',
        });
        toast({
          title: 'Éxito',
          description: 'Miembro creado correctamente',
        });
      }
      setIsDialogOpen(false);
      loadMembers();
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
    if (window.confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
      try {
        await memberServices.delete(id);
        toast({
          title: 'Éxito',
          description: 'Miembro eliminado correctamente',
        });
        loadMembers();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el miembro',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      membership_type: '',
      start_date: '',
      end_date: '',
    });
    setSelectedMember(null);
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      membership_type: member.membership_type,
      start_date: member.start_date,
      end_date: member.end_date,
    });
    setIsDialogOpen(true);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className={isMobile ? "ml-14" : ""}>
          <h1 className="text-lg md:text-xl font-bold text-white">Miembros</h1>
        </div>
        <div className="text-white text-xs md:text-sm">Administrador</div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar miembros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-[#1A1F2C] border-gray-700 text-white"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white ml-4"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {!isMobile && "Nuevo Miembro"}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A1F2C] border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                {selectedMember ? 'Editar Miembro' : 'Nuevo Miembro'}
              </DialogTitle>
              <DialogDescription>Completa los datos del miembro y guarda los cambios.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Nombre
                  </label>
                  <Input
                    required
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className="bg-[#222732] border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Apellido
                  </label>
                  <Input
                    required
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className="bg-[#222732] border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Email
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#222732] border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Teléfono
                </label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-[#222732] border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Tipo de Membresía
                </label>
                <Select
                  value={formData.membership_type}
                  onValueChange={(value) => setFormData({ ...formData, membership_type: value })}
                >
                  <SelectTrigger className="bg-[#222732] border-gray-700 text-white">
                    <SelectValue placeholder="Seleccionar membresía" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222732] border-gray-700 text-white">
                    <SelectItem value="Estándar">Estándar</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Fecha Inicio
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="bg-[#222732] border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Fecha Fin
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="bg-[#222732] border-gray-700 text-white"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {selectedMember ? 'Actualizar' : 'Crear'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-700 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#222732]">
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Nombre</TableHead>
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300 hidden md:table-cell">Teléfono</TableHead>
                <TableHead className="text-gray-300">Membresía</TableHead>
                <TableHead className="text-gray-300">Estado</TableHead>
                <TableHead className="text-gray-300 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                    No se encontraron miembros
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id} className="border-gray-700 bg-[#1A1F2C] hover:bg-[#222732]">
                    <TableCell className="font-medium text-white">
                      {member.first_name} {member.last_name}
                    </TableCell>
                    <TableCell className="text-gray-300">{member.email}</TableCell>
                    <TableCell className="text-gray-300 hidden md:table-cell">{member.phone}</TableCell>
                    <TableCell className="text-gray-300">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          member.membership_type === 'Premium'
                            ? 'bg-green-900/40 text-green-300'
                            : member.membership_type === 'VIP'
                            ? 'bg-purple-900/40 text-purple-300'
                            : 'bg-blue-900/40 text-blue-300'
                        }`}
                      >
                        {member.membership_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          member.status === 'active'
                            ? 'bg-green-900/40 text-green-300'
                            : 'bg-red-900/40 text-red-300'
                        }`}
                      >
                        {member.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(member)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
