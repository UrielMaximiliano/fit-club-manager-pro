
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

const payments = [
  {
    id: "P001",
    member: "Juan Pérez",
    amount: "$25.000",
    concept: "Mensualidad - Plan Básico",
    date: "28/04/2025",
    method: "Efectivo",
    status: "Completado"
  },
  {
    id: "P002",
    member: "María González",
    amount: "$65.000",
    concept: "Plan Trimestral",
    date: "27/04/2025",
    method: "Tarjeta",
    status: "Completado"
  },
  {
    id: "P003",
    member: "Carlos Rodríguez",
    amount: "$25.000",
    concept: "Mensualidad - Plan Básico",
    date: "26/04/2025",
    method: "Transferencia",
    status: "Completado"
  },
  {
    id: "P004",
    member: "Ana Martínez",
    amount: "$120.000",
    concept: "Plan Semestral",
    date: "25/04/2025",
    method: "Tarjeta",
    status: "Completado"
  }
];

export default function Payments() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Pagos</h1>
          <p className="text-gray-400">Gestiona los pagos de los miembros</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Resumen de Pagos</CardTitle>
          <CardDescription className="text-gray-400">Estadísticas del mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Recaudado</div>
              <div className="text-2xl font-bold mt-1">$1,235,000</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Pagos Procesados</div>
              <div className="text-2xl font-bold mt-1">47</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Promedio por Pago</div>
              <div className="text-2xl font-bold mt-1">$26,276</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle>Registro de Pagos</CardTitle>
            <CardDescription className="text-gray-400">Historial completo de pagos realizados</CardDescription>
          </div>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar pago o miembro..."
                className="pl-8 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="mr-2 h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'overflow-auto' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Miembro</TableHead>
                  <TableHead className="text-gray-400">Concepto</TableHead>
                  <TableHead className="text-gray-400">Fecha</TableHead>
                  <TableHead className="text-gray-400">Monto</TableHead>
                  <TableHead className="text-gray-400">Método</TableHead>
                  <TableHead className="text-gray-400">Estado</TableHead>
                  <TableHead className="text-gray-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>{payment.member}</TableCell>
                    <TableCell>{payment.concept}</TableCell>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-300">
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <span className="sr-only">Detalles</span>
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
