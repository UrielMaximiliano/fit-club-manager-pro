import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Member } from '../services/types';
import { Attendance } from '../services/types';
import { memberServices } from '../services/memberService';
import { attendanceServices } from '../services/attendanceService';

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [attendancesData, membersData] = await Promise.all([
        attendanceServices.getAll(),
        memberServices.getAll(),
      ]);
      setAttendances(attendancesData);
      setMembers(membersData);
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
    const unsubscribeAttendances = attendanceServices.onDataChange((data) => {
      setAttendances(data);
      toast({
        title: 'Actualización',
        description: 'Los datos de asistencias se han actualizado',
      });
    });
    
    const unsubscribeMembers = memberServices.onDataChange((data) => {
      setMembers(data);
    });
    
    // Limpiar suscripciones al desmontar
    return () => {
      unsubscribeAttendances();
      unsubscribeMembers();
    };
  }, []);

  const handleCheckIn = async () => {
    if (!selectedMemberId) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un miembro',
        variant: 'destructive',
      });
      return;
    }

    try {
      await attendanceServices.checkIn(selectedMemberId);
      toast({
        title: 'Éxito',
        description: 'Entrada registrada correctamente',
      });
      loadData();
      setSelectedMemberId('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo registrar la entrada',
        variant: 'destructive',
      });
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      await attendanceServices.checkOut(id);
      toast({
        title: 'Éxito',
        description: 'Salida registrada correctamente',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo registrar la salida',
        variant: 'destructive',
      });
    }
  };

  const filteredAttendances = attendances.filter((attendance: any) => {
    const memberName = `${attendance.members?.first_name} ${attendance.members?.last_name}`.toLowerCase();
    return memberName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Control de Asistencias</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Registrar Entrada</h2>
          <div className="flex gap-2">
            <Select
              value={selectedMemberId}
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger className="flex-1">
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
            <Button onClick={handleCheckIn}>
              Registrar Entrada
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Buscar Asistencias</h2>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nombre de miembro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
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
                <TableHead>Entrada</TableHead>
                <TableHead>Salida</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendances.map((attendance: any) => (
                <TableRow key={attendance.id}>
                  <TableCell>
                    {new Date(attendance.check_in).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {attendance.members?.first_name} {attendance.members?.last_name}
                  </TableCell>
                  <TableCell>
                    {new Date(attendance.check_in).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {attendance.check_out
                      ? new Date(attendance.check_out).toLocaleTimeString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {!attendance.check_out && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCheckOut(attendance.id)}
                      >
                        Registrar Salida
                      </Button>
                    )}
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
