
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
import { Search, CalendarDays } from 'lucide-react';

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
  
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="flex justify-end mb-4 md:mb-6">
        <div className="text-white">Administrador</div>
      </div>
      
      <Card className="bg-[#1A1F2C] border-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold text-white">Miembros</CardTitle>
              <CardDescription className="text-gray-400">Ver y gestionar las rutinas de ejercicio de los miembros</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead className="text-gray-300">Nombre</TableHead>
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
                      <TableCell className="font-medium text-white">{student.name}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{student.age}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                      <TableCell className="text-right">
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
    </>
  );
};

export default StudentRoutines;
