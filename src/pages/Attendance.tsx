
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

// Datos de ejemplo para asistencias
const attendanceData = [
  {
    id: 1,
    member: "Juan Pérez",
    date: "30/04/2025",
    time: "08:15",
    duration: "1h 25m",
  },
  {
    id: 2,
    member: "María González",
    date: "30/04/2025",
    time: "10:30",
    duration: "2h 05m",
  },
  {
    id: 3,
    member: "Carlos Rodríguez",
    date: "30/04/2025",
    time: "16:45",
    duration: "1h 30m",
  },
  {
    id: 4,
    member: "Ana Martínez",
    date: "29/04/2025",
    time: "09:00",
    duration: "1h 15m",
  },
  {
    id: 5,
    member: "Pedro Sánchez",
    date: "29/04/2025",
    time: "18:20",
    duration: "45m",
  }
];

export default function Attendance() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("Abril 2025");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Asistencias</h1>
          <p className="text-gray-400">Control de asistencias de miembros</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Calendar className="mr-2 h-4 w-4" />
            Registrar Asistencia
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Descargar Reporte
          </Button>
        </div>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Estadísticas de Asistencia</CardTitle>
          <CardDescription className="text-gray-400">Resumen de actividad reciente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Hoy</div>
              <div className="text-2xl font-bold mt-1">17</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Promedio Diario</div>
              <div className="text-2xl font-bold mt-1">22</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Semanal</div>
              <div className="text-2xl font-bold mt-1">148</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Mensual</div>
              <div className="text-2xl font-bold mt-1">632</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Ocupación por Horas</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" className="h-7 w-7 border-gray-600">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">{currentDate}</span>
                <Button variant="outline" size="icon" className="h-7 w-7 border-gray-600">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Gráfico simplificado de ocupación */}
            <div className="w-full h-32 bg-gray-700 rounded-lg p-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>6:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>22:00</span>
              </div>
              <div className="relative h-20">
                {/* Barras de ocupación - Esto sería un gráfico real en la implementación completa */}
                <div className="absolute bottom-0 left-[5%] w-[5%] h-[30%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[12%] w-[5%] h-[45%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[19%] w-[5%] h-[65%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[26%] w-[5%] h-[80%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[33%] w-[5%] h-[70%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[40%] w-[5%] h-[50%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[47%] w-[5%] h-[45%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[54%] w-[5%] h-[40%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[61%] w-[5%] h-[55%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[68%] w-[5%] h-[75%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[75%] w-[5%] h-[90%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[82%] w-[5%] h-[65%] bg-blue-600 rounded-t"></div>
                <div className="absolute bottom-0 left-[89%] w-[5%] h-[40%] bg-blue-600 rounded-t"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle>Registro de Asistencias</CardTitle>
            <CardDescription className="text-gray-400">Historial de ingresos al gimnasio</CardDescription>
          </div>
          <div className="relative w-full md:w-64 mt-2 md:mt-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar miembro..."
              className="pl-8 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'overflow-auto' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">Miembro</TableHead>
                  <TableHead className="text-gray-400">Fecha</TableHead>
                  <TableHead className="text-gray-400">Hora de entrada</TableHead>
                  <TableHead className="text-gray-400">Duración</TableHead>
                  <TableHead className="text-gray-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((attendance) => (
                  <TableRow key={attendance.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell className="font-medium">{attendance.member}</TableCell>
                    <TableCell>{attendance.date}</TableCell>
                    <TableCell>{attendance.time}</TableCell>
                    <TableCell>{attendance.duration}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <span className="sr-only">Editar</span>
                        <Search className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
