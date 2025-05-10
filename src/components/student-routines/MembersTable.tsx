
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { Member } from '@/services/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface MembersTableProps {
  loading: boolean;
  students: Member[];
}

export const MembersTable = ({ loading, students }: MembersTableProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="rounded-md border border-gray-700 overflow-x-auto">
      <Table>
        <TableHeader className="bg-[#222732]">
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300 py-2">Nombre</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Email</TableHead>
            <TableHead className="text-gray-300">Membresía</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Fecha Alta</TableHead>
            <TableHead className="text-gray-300 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="border-gray-700">
              <TableCell colSpan={5} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : students.length === 0 ? (
            <TableRow className="border-gray-700">
              <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                No se encontraron miembros
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id} className="border-gray-700 bg-[#1A1F2C] hover:bg-[#222732]">
                <TableCell className="font-medium text-white py-2">{student.first_name} {student.last_name}</TableCell>
                <TableCell className="text-gray-300 hidden md:table-cell">{student.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    student.membership_type === "Premium" 
                      ? "bg-green-900 text-green-300" 
                      : student.membership_type === "Standard"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-gray-800 text-gray-300"
                  }`}>
                    {student.membership_type}
                  </span>
                </TableCell>
                <TableCell className="text-gray-300 hidden md:table-cell">{student.start_date}</TableCell>
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
  );
};
