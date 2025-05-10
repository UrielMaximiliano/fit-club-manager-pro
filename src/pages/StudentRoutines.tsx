
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Member, memberServices } from '@/services/supabaseService';
import { SearchBar } from '@/components/student-routines/SearchBar';
import { MembersTable } from '@/components/student-routines/MembersTable';
import { FormDialog } from '@/components/student-routines/FormDialog';
import { MemberFormValues } from '@/components/student-routines/MemberForm';

const StudentRoutines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await memberServices.getAll();
      setStudents(data);
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

  const handleSubmit = async (values: MemberFormValues) => {
    try {
      setLoading(true);
      // Preparar datos del miembro para guardar en Supabase
      const memberData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        membership_type: values.membership_type,
        status: 'active' as const,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      
      // Guardar en la base de datos
      await memberServices.create(memberData);
      
      // Actualizar la lista local
      await loadMembers();
      
      // Cerrar el diálogo
      setIsDialogOpen(false);
      
      // Notificar al usuario
      toast({
        title: "Miembro creado",
        description: `${values.first_name} ${values.last_name} ha sido agregado con éxito y se le ha asignado la rutina "${values.routineName}"`,
      });
    } catch (error) {
      console.error("Error al guardar el miembro:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar el miembro en la base de datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredStudents = students.filter(student => 
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.membership_type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="pb-6">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div className={isMobile ? "ml-14" : ""}>
          <h1 className="text-lg md:text-xl font-bold text-white">Miembros</h1>
        </div>
        <div className="text-white text-sm">Administrador</div>
      </div>
      
      <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg overflow-hidden">
        <CardHeader className="p-3 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl font-bold text-white">Miembros</CardTitle>
              <CardDescription className="text-sm text-gray-400">Ver y gestionar las rutinas de ejercicio de los miembros</CardDescription>
            </div>
            <FormDialog 
              isOpen={isDialogOpen} 
              setIsOpen={setIsDialogOpen} 
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center mb-4">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
          
          <MembersTable loading={loading} students={filteredStudents} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRoutines;
