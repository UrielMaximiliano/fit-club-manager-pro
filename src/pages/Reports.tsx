import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from "jspdf";

export default function Reports() {
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState("Abril 2025");

  // Generate PDF for reports
  const handleDownload = (reportName: string) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Reporte: ${reportName}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Período: ${selectedPeriod}`, 10, 20);

    // No sample data, user will test with real data

    doc.save(`${reportName.replace(/\s+/g, '_')}_${selectedPeriod}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Reportes</h1>
          <p className="text-gray-400">Análisis y estadísticas del negocio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-gray-600" onClick={() => {/* TODO: change period to previous */}}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white">{selectedPeriod}</span>
          <Button variant="outline" size="sm" className="border-gray-600" onClick={() => {/* TODO: change period to next */}}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ingresos vs Gastos</CardTitle>
              <CardDescription className="text-gray-400">Balance financiero mensual</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => handleDownload("Ingresos vs Gastos")}>
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* No sample chart data */}
            <div className="h-64 flex items-center justify-center text-gray-500">
              Gráfico no disponible - Sin datos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Asistencias por Día</CardTitle>
              <CardDescription className="text-gray-400">Actividad de miembros</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => handleDownload("Asistencias por Día")}>
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* No sample chart data */}
            <div className="h-64 flex items-center justify-center text-gray-500">
              Gráfico no disponible - Sin datos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Membresías Activas</CardTitle>
              <CardDescription className="text-gray-400">Distribución por tipo de plan</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => handleDownload("Membresías Activas")}>
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* No sample chart data */}
            <div className="h-40 flex items-center justify-center text-gray-500">
              Gráfico no disponible - Sin datos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Renovaciones y Bajas</CardTitle>
              <CardDescription className="text-gray-400">Retención de miembros</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={() => handleDownload("Renovaciones y Bajas")}>
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* No sample chart data */}
            <div className="h-40 flex items-center justify-center text-gray-500">
              Gráfico no disponible - Sin datos
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-col md:flex-row justify-between">
          <div>
            <CardTitle>Exportar Reportes</CardTitle>
            <CardDescription className="text-gray-400">Descarga informes detallados</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'overflow-auto' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">Tipo de Reporte</TableHead>
                  <TableHead className="text-gray-400">Descripción</TableHead>
                  <TableHead className="text-gray-400">Período</TableHead>
                  <TableHead className="text-gray-400 text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* No sample data */}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
