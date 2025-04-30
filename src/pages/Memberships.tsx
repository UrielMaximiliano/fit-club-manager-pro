
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const membershipPlans = [
  {
    id: 1,
    name: "Plan Básico",
    price: "$25.000",
    duration: "1 mes",
    description: "Acceso a todas las áreas del gimnasio",
    active: true
  },
  {
    id: 2,
    name: "Plan Trimestral",
    price: "$65.000",
    duration: "3 meses",
    description: "Acceso a todas las áreas + 1 clase semanal",
    active: true
  },
  {
    id: 3,
    name: "Plan Semestral",
    price: "$120.000",
    duration: "6 meses",
    description: "Acceso completo + 2 clases semanales + 1 evaluación",
    active: true
  },
  {
    id: 4,
    name: "Plan Anual",
    price: "$200.000",
    duration: "12 meses",
    description: "Acceso completo + todas las clases + evaluación mensual",
    active: true
  }
];

export default function Memberships() {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Membresías</h1>
          <p className="text-gray-400">Administra los planes de membresía del gimnasio</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {membershipPlans.map((plan) => (
          <Card key={plan.id} className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-gray-400">{plan.duration}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{plan.price}</div>
              <p className="text-sm text-gray-300 mb-4">{plan.description}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">Editar</Button>
                <Button variant="destructive" size="sm" className="flex-1">Desactivar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Historial de Cambios en Planes</CardTitle>
          <CardDescription className="text-gray-400">Registro de modificaciones a los planes de membresía</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'overflow-auto' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">Fecha</TableHead>
                  <TableHead className="text-gray-400">Plan</TableHead>
                  <TableHead className="text-gray-400">Cambio</TableHead>
                  <TableHead className="text-gray-400">Usuario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell>10/04/2025</TableCell>
                  <TableCell>Plan Básico</TableCell>
                  <TableCell>Aumento de precio: $22.000 → $25.000</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell>15/03/2025</TableCell>
                  <TableCell>Plan Anual</TableCell>
                  <TableCell>Modificación de beneficios</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell>01/03/2025</TableCell>
                  <TableCell>Plan Trimestral</TableCell>
                  <TableCell>Creación del plan</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
