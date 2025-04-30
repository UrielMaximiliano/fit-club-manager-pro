
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

// Datos de ejemplo para transacciones
const transactions = [
  {
    id: "T001",
    date: "30/04/2025",
    concept: "Pago de membresía - Juan Pérez",
    type: "Ingreso",
    amount: "$25.000",
  },
  {
    id: "T002",
    date: "29/04/2025",
    concept: "Compra de productos de limpieza",
    type: "Gasto",
    amount: "$15.000",
  },
  {
    id: "T003",
    date: "29/04/2025",
    concept: "Pago de membresía - María González",
    type: "Ingreso",
    amount: "$65.000",
  },
  {
    id: "T004",
    date: "28/04/2025",
    concept: "Reparación de equipo",
    type: "Gasto",
    amount: "$45.000",
  },
  {
    id: "T005",
    date: "28/04/2025",
    concept: "Pago de membresía - Carlos Rodríguez",
    type: "Ingreso",
    amount: "$25.000",
  }
];

export default function Cashbox() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Caja</h1>
          <p className="text-gray-400">Administración de ingresos y gastos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950">
            <ArrowDown className="mr-2 h-4 w-4" />
            Registrar Ingreso
          </Button>
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950">
            <ArrowUp className="mr-2 h-4 w-4" />
            Registrar Gasto
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calendar className="mr-2 h-4 w-4" />
            Cierre de Caja
          </Button>
        </div>
      </div>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Resumen de Caja</CardTitle>
          <CardDescription className="text-gray-400">Estado actual de la caja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Saldo Actual</div>
              <div className="text-2xl font-bold mt-1">$567,000</div>
            </div>
            <div className="bg-blue-900 p-4 rounded-lg">
              <div className="text-blue-300 text-sm">Ingresos Hoy</div>
              <div className="text-2xl font-bold mt-1 text-blue-200">$115,000</div>
            </div>
            <div className="bg-red-900 p-4 rounded-lg">
              <div className="text-red-300 text-sm">Gastos Hoy</div>
              <div className="text-2xl font-bold mt-1 text-red-200">$60,000</div>
            </div>
            <div className="bg-green-900 p-4 rounded-lg">
              <div className="text-green-300 text-sm">Balance Hoy</div>
              <div className="text-2xl font-bold mt-1 text-green-200">$55,000</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Flujo de Efectivo</h3>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Este mes
              </Button>
            </div>
            
            {/* Gráfico simplificado de flujo de caja */}
            <div className="w-full h-32 bg-gray-700 rounded-lg p-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>01/04</span>
                <span>08/04</span>
                <span>15/04</span>
                <span>22/04</span>
                <span>30/04</span>
              </div>
              <div className="relative h-20">
                <div className="absolute top-1/2 w-full h-[1px] bg-gray-600"></div>
                
                {/* Líneas de flujo - Esto sería un gráfico real en la implementación completa */}
                <svg className="absolute inset-0 w-full h-full">
                  <polyline 
                    points="0,40 30,35 60,42 90,30 120,38 150,25 180,20 210,28 240,15 270,22 300,18"
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="2" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle>Transacciones</CardTitle>
            <CardDescription className="text-gray-400">Historial de movimientos en caja</CardDescription>
          </div>
          <div className="relative w-full md:w-64 mt-2 md:mt-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar transacción..."
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
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Fecha</TableHead>
                  <TableHead className="text-gray-400">Concepto</TableHead>
                  <TableHead className="text-gray-400">Tipo</TableHead>
                  <TableHead className="text-gray-400">Monto</TableHead>
                  <TableHead className="text-gray-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.concept}</TableCell>
                    <TableCell>
                      {transaction.type === "Ingreso" ? (
                        <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                          Ingreso
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-red-900 text-red-300">
                          Gasto
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={transaction.type === "Ingreso" ? "text-blue-400" : "text-red-400"}>
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <span className="sr-only">Ver detalles</span>
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
