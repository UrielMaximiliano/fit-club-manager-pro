import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, UserPlus, X, Dumbbell, Calendar } from 'lucide-react';
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
import { Member, memberServices } from '@/services';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from '@/hooks/use-mobile';
import { Rutina, DiaRutina, Ejercicio } from '@/models/Rutina';

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

  const [rutinaModalOpen, setRutinaModalOpen] = useState<string | null>(null);
  const [rutinaDraft, setRutinaDraft] = useState<DiaRutina[]>([]);
  const [rutinaVersion, setRutinaVersion] = useState(0);
  const [nuevoDia, setNuevoDia] = useState('');
  const [nuevoEjercicio, setNuevoEjercicio] = useState<{ [key: string]: { nombre: string; repeticiones: string; peso: string } }>({});

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

  const getRutina = (idMiembro: string): DiaRutina[] => {
    const data = localStorage.getItem(`rutina_${idMiembro}`);
    return data ? JSON.parse(data) : [];
  };

  const saveRutina = (idMiembro: string, dias: DiaRutina[]) => {
    localStorage.setItem(`rutina_${idMiembro}`, JSON.stringify(dias));
  };

  const handleOpenRutinaModal = (idMiembro: string) => {
    setRutinaDraft(getRutina(idMiembro));
    setRutinaModalOpen(idMiembro);
  };

  const handleSaveRutina = (idMiembro: string) => {
    saveRutina(idMiembro, rutinaDraft);
    setRutinaModalOpen(null);
    setRutinaVersion(v => v + 1);
  };

  return (
    <div className="pb-10 min-h-screen bg-[#222732]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-100"></h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-sm px-3 py-2 text-sm font-medium"
          size="icon"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Nuevo Miembro</span>
        </Button>
      </div>
      <div className="rounded-xl overflow-hidden shadow-sm border border-gray-700 bg-[#222732]">
        <div className="flex items-center gap-2 mb-6 max-w-lg w-full px-6 pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar miembros por nombre o email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 bg-[#222732] border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-[#222732]">
            <TableRow>
              <TableHead className="text-gray-400 font-semibold">Nombre</TableHead>
              <TableHead className="text-gray-400 font-semibold">Email</TableHead>
              <TableHead className="text-gray-400 font-semibold hidden md:table-cell">Teléfono</TableHead>
              <TableHead className="text-gray-400 font-semibold">Membresía</TableHead>
              <TableHead className="text-gray-400 font-semibold">Estado</TableHead>
              <TableHead className="text-gray-400 font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody key={rutinaVersion}>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                  No se encontraron miembros
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
                <React.Fragment key={member.id}>
                  <TableRow className="bg-[#222732] hover:bg-[#18181b] border-b border-gray-700 transition-all">
                    <TableCell className="font-medium text-gray-100">{member.first_name} {member.last_name}</TableCell>
                    <TableCell className="text-gray-300">{member.email}</TableCell>
                    <TableCell className="text-gray-300 hidden md:table-cell">{member.phone}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.membership_type === 'Premium'
                        ? 'bg-blue-900/40 text-blue-300'
                        : member.membership_type === 'VIP'
                        ? 'bg-purple-900/40 text-purple-300'
                        : 'bg-gray-700 text-gray-200'}`}>{member.membership_type}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active'
                        ? 'bg-green-900/40 text-green-300'
                        : 'bg-red-900/40 text-red-300'}`}>{member.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-1 justify-end items-center">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400" onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-400" onClick={() => handleDelete(member.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                        <button
                          onClick={() => handleOpenRutinaModal(member.id)}
                          className="text-blue-400 hover:underline text-sm font-medium px-2 py-1 bg-transparent border-none focus:outline-none"
                          style={{ minWidth: 0 }}
                        >
                          Ver Rutina
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} className="bg-transparent px-0 py-0 border-none">
                      <div className="mx-6 my-2">
                        <div className="rounded-lg bg-[#222732] border border-gray-700 shadow-sm px-4 py-3 text-sm text-gray-100">
                          <strong className="block text-xs text-gray-400 mb-1">Rutina:</strong>
                          {getRutina(member.id).length > 0 ? (
                            <ul className="space-y-1">
                              {getRutina(member.id).map((dia: DiaRutina) => (
                                <li key={dia.dia} className="mb-1">
                                  <span className="font-semibold text-gray-100">{dia.dia}:</span>
                                  <ul className="ml-4 list-disc text-gray-300">
                                    {dia.ejercicios.map((ex: Ejercicio, idx: number) => (
                                      <li key={idx} className="ml-2">
                                        {ex.nombre} - {ex.repeticiones} reps - {ex.peso} kg
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-600">Sin rutina</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Modal de edición de rutina */}
                  <Dialog open={rutinaModalOpen === member.id} onOpenChange={() => setRutinaModalOpen(null)}>
                    <DialogContent className="max-w-xl w-full rounded-2xl shadow-2xl border border-gray-700 bg-[#232329] p-4 sm:p-8 text-gray-100 transition-all duration-300 ease-in-out overflow-y-auto max-h-[90vh] flex flex-col">
                      {/* Encabezado */}
                      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#232329] z-10 pb-2">
                        <DialogTitle className="text-2xl font-semibold text-gray-100">Rutina del Miembro</DialogTitle>
                        <button
                          onClick={() => setRutinaModalOpen(null)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-2 rounded-full"
                          title="Cerrar"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      {/* Agregar Día */}
                      <form
                        className="flex flex-col sm:flex-row gap-2 mb-6"
                        onSubmit={e => {
                          e.preventDefault();
                          if (nuevoDia && !rutinaDraft.find(d => d.dia.toLowerCase() === nuevoDia.toLowerCase())) {
                            setRutinaDraft([...rutinaDraft, { dia: nuevoDia, ejercicios: [] }]);
                            setNuevoDia('');
                          }
                        }}
                      >
                        <div className="relative flex-1 min-w-0">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input
                            value={nuevoDia}
                            onChange={e => setNuevoDia(e.target.value)}
                            placeholder="Día (ej: LUNES)"
                            className="pl-10 pr-3 py-2 bg-[#18181b] border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-400 transition-all w-full"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4" /> Día
                        </Button>
                      </form>
                      {/* Lista de días y ejercicios */}
                      <div className="space-y-6">
                        {rutinaDraft.length === 0 && (
                          <div className="text-gray-400 text-center py-8 text-base">Agrega un día para comenzar la rutina</div>
                        )}
                        {rutinaDraft.map((dia, idx) => {
                          const totalPeso = dia.ejercicios.reduce((acc, ej) => acc + (Number(ej.peso) || 0), 0);
                          return (
                            <div key={dia.dia} className="bg-[#18181b] rounded-xl p-4 shadow-sm border border-gray-700 transition-all duration-300">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                                <span className="uppercase font-semibold text-gray-100 tracking-wide break-words">{dia.dia}</span>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-xs text-blue-400 font-semibold" title="Total de peso">{totalPeso} kg</span>
                                  <button
                                    onClick={() => setRutinaDraft(rutinaDraft.filter((_, i) => i !== idx))}
                                    className="text-gray-400 hover:text-red-400 p-2 rounded-full transition-colors"
                                    title="Eliminar Día"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <hr className="my-2 border-gray-700" />
                              {/* Ejercicios */}
                              <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-2">
                                {dia.ejercicios.map((ex, exIdx) => (
                                  <div key={exIdx} className="flex items-center gap-2 bg-[#232329] border border-gray-700 rounded-lg px-3 py-1.5 shadow-sm transition-all duration-300 w-full sm:w-auto min-w-0">
                                    <Dumbbell className="h-4 w-4 text-blue-400" />
                                    <span className="font-medium text-gray-100 truncate max-w-[120px] sm:max-w-[180px]">{ex.nombre}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-xs text-gray-300">{ex.repeticiones} reps</span>
                                    <span className="text-gray-700">•</span>
                                    <span className="text-xs text-blue-400">{ex.peso} kg</span>
                                    <button
                                      onClick={() => {
                                        const copia = [...rutinaDraft];
                                        copia[idx].ejercicios = copia[idx].ejercicios.filter((_, i) => i !== exIdx);
                                        setRutinaDraft(copia);
                                      }}
                                      className="ml-1 text-gray-400 hover:text-red-400 p-1 rounded-full transition-colors"
                                      title="Eliminar ejercicio"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              {/* Agregar Ejercicio */}
                              <form
                                className="flex flex-col sm:flex-row gap-2 items-end mt-2"
                                onSubmit={e => {
                                  e.preventDefault();
                                  const { nombre, repeticiones, peso } = nuevoEjercicio[dia.dia] || {};
                                  if (nombre && repeticiones && peso) {
                                    const copia = [...rutinaDraft];
                                    copia[idx].ejercicios.push({ nombre, repeticiones: parseInt(repeticiones, 10), peso: parseFloat(peso) });
                                    setRutinaDraft(copia);
                                    setNuevoEjercicio({ ...nuevoEjercicio, [dia.dia]: { nombre: '', repeticiones: '', peso: '' } });
                                  }
                                }}
                              >
                                <Input
                                  placeholder="Ejercicio"
                                  value={nuevoEjercicio[dia.dia]?.nombre || ''}
                                  onChange={e => setNuevoEjercicio({
                                    ...nuevoEjercicio,
                                    [dia.dia]: { ...nuevoEjercicio[dia.dia], nombre: e.target.value }
                                  })}
                                  className="bg-[#222732] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 w-full sm:w-36 min-w-0"
                                  required
                                />
                                <Input
                                  placeholder="Reps"
                                  type="number"
                                  min={1}
                                  value={nuevoEjercicio[dia.dia]?.repeticiones || ''}
                                  onChange={e => setNuevoEjercicio({
                                    ...nuevoEjercicio,
                                    [dia.dia]: { ...nuevoEjercicio[dia.dia], repeticiones: e.target.value }
                                  })}
                                  className="bg-[#222732] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 w-full sm:w-20 min-w-0"
                                  required
                                />
                                <Input
                                  placeholder="Peso (kg)"
                                  type="number"
                                  min={0}
                                  value={nuevoEjercicio[dia.dia]?.peso || ''}
                                  onChange={e => setNuevoEjercicio({
                                    ...nuevoEjercicio,
                                    [dia.dia]: { ...nuevoEjercicio[dia.dia], peso: e.target.value }
                                  })}
                                  className="bg-[#222732] border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-blue-400 w-full sm:w-28 min-w-0"
                                  required
                                />
                                <Button
                                  type="submit"
                                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow px-4 py-2 flex items-center gap-2 w-full sm:w-auto"
                                >
                                  <Plus className="h-4 w-4" /> Ejercicio
                                </Button>
                              </form>
                            </div>
                          );
                        })}
                      </div>
                      {/* Botones finales */}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                        <Button
                          onClick={() => setRutinaModalOpen(null)}
                          variant="outline"
                          className="rounded-lg border border-gray-700 bg-[#232329] text-gray-100 font-semibold px-6 py-2 shadow-sm hover:bg-[#18181b] transition-all w-full sm:w-auto"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleSaveRutina(member.id)}
                          variant="default"
                          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-lg w-full sm:w-auto transition-all"
                        >
                          Guardar Rutina
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
