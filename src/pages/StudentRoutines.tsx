
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
import { Search, ArrowLeft, Eye } from 'lucide-react';

// Mock data for student list
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
  
  const filteredStudents = studentsData.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Student Routines</CardTitle>
          <CardDescription>View and manage students' weekly exercise routines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name or membership type..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Membership Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.age}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          student.membershipType === "Premium" 
                            ? "bg-green-100 text-green-800" 
                            : student.membershipType === "Standard"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {student.membershipType}
                        </span>
                      </TableCell>
                      <TableCell>{student.routineUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/routines/${student.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Routine
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
