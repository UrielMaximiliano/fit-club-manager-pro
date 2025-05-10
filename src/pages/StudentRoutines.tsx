
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CalendarDays, UserPlus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Esquema de validación
const memberRoutineSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  age: z.coerce.number().min(16).max(99),
  membershipType: z.string({
    required_error: "Por favor selecciona un tipo de membresía.",
  }),
  routineName: z.string().min(3, {
    message: "El nombre de la rutina debe tener al menos 3 caracteres.",
  }),
  routineDays: z.coerce.number().min(1).max(7),
  notes: z.string().optional(),
});

// Mock data para la lista de estudiantes
const studentsData = [
  { id: 1, name: "John Doe", age: 22, membershipType: "Premium", routineUpdated: "2025-04-05" },
  { id: 2, name: "Jane Smith", age: 24, membershipType: "Standard", routineUpdated: "2025-04-01" },
  { id: 3, name: "Michael Johnson", age: 28, membershipType: "Premium", routineUpdated: "2025-04-07" },
  { id: 4, name: "Emily Davis", age: 21, membershipType: "Standard", routineUpdated: "2025-03-28" },
  { id: 5, name: "Robert Wilson", age: 25, membershipType: "Premium", routineUpdated: "2025-04-02" },
  { id: 6, name: "Sarah Brown", age: 23, membershipType: "Basic", routineUpdated: "2025-03-25" },
  { id: 7, name: "David Miller", age: 26, membershipType: "Standard", routineUpdated: "2025-04-06" },
  { id: 8, name: "Jessica Taylor", age: 22, membershipType: "Basic", routineUpdated: "2025-03-30" }
];

const StudentRoutines = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [students, setStudents] = useState(studentsData);
  
  // Configurar el formulario con validación
  const form = useForm<z.infer<typeof memberRoutineSchema>>({
    resolver: zodResolver(memberRoutineSchema),
    defaultValues: {
      name: "",
      age: 18,
      membershipType: "",
      routineName: "",
      routineDays: 3,
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof memberRoutineSchema>) => {
    // Simular la creación de un nuevo miembro con rutina
    const newId = Math.max(...students.map(s => s.id)) + 1;
    const today = new Date().toISOString().split('T')[0];
    
    const newStudent = {
      id: newId,
      name: values.name,
      age: values.age,
      membershipType: values.membershipType,
      routineUpdated: today
    };
    
    setStudents([newStudent, ...students]);
    setIsDialogOpen(false);
    form.reset();
    
    toast({
      title: "Miembro creado",
      description: `${values.name} ha sido agregado con éxito y se le ha asignado la rutina "${values.routineName}"`,
    });
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {!isMobile && "Nuevo Miembro con Rutina"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1F2C] border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Nuevo Miembro con Rutina</DialogTitle>
                  <DialogDescription>Completa los datos del miembro y su rutina de ejercicios</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-gray-300 border-b border-gray-700 pb-1">Datos del Miembro</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Nombre completo</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Nombre del miembro" 
                                  className="bg-[#222732] border-gray-700 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Edad</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="bg-[#222732] border-gray-700 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="membershipType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Tipo de membresía</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-[#222732] border-gray-700 text-white">
                                  <SelectValue placeholder="Selecciona tipo de membresía" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#1A1F2C] border-gray-700 text-white">
                                <SelectItem value="Premium">Premium</SelectItem>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="Basic">Basic</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <h3 className="font-medium text-sm text-gray-300 border-b border-gray-700 pb-1">Información de Rutina</h3>
                      <FormField
                        control={form.control}
                        name="routineName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Nombre de la Rutina</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ej: Rutina de fuerza" 
                                className="bg-[#222732] border-gray-700 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="routineDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Días por semana</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={7}
                                className="bg-[#222732] border-gray-700 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Notas adicionales</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observaciones o recomendaciones..." 
                                className="bg-[#222732] border-gray-700 text-white resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription className="text-gray-400 text-xs">
                              Cualquier detalle importante sobre la rutina o el miembro.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        className="mr-2 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Guardar
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={isMobile ? "Buscar..." : "Buscar por nombre o tipo de membresía..."} 
                className="pl-8 bg-[#222732] border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border border-gray-700 overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#222732]">
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300 py-2">Nombre</TableHead>
                  <TableHead className="text-gray-300 hidden md:table-cell">Edad</TableHead>
                  <TableHead className="text-gray-300">Membresía</TableHead>
                  <TableHead className="text-gray-300 hidden md:table-cell">Actualización</TableHead>
                  <TableHead className="text-gray-300 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                      No se encontraron miembros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id} className="border-gray-700 bg-[#1A1F2C] hover:bg-[#222732]">
                      <TableCell className="font-medium text-white py-2">{student.name}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{student.age}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          student.membershipType === "Premium" 
                            ? "bg-green-900 text-green-300" 
                            : student.membershipType === "Standard"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-gray-800 text-gray-300"
                        }`}>
                          {student.membershipType}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{student.routineUpdated}</TableCell>
                      <TableCell className="text-right py-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-blue-700 hover:bg-blue-800 text-white border-blue-600"
                          onClick={() => navigate(`/routines/${student.id}`)}
                        >
                          <CalendarDays className="h-4 w-4 mr-1" /> 
                          {!isMobile && "Ver Rutina"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentRoutines;
