
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

export default function Reports() {
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState("Abril 2025");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Reportes</h1>
          <p className="text-gray-400">Análisis y estadísticas del negocio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-gray-600">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white">{selectedPeriod}</span>
          <Button variant="outline" size="sm" className="border-gray-600">
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
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Gráfico simplificado de barras */}
            <div className="h-64 flex items-end justify-around space-x-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-blue-600 rounded-t" style={{height: '120px'}}></div>
                <div className="w-16 bg-red-600 rounded-t" style={{height: '70px'}}></div>
                <div className="text-xs text-gray-400">Semana 1</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-blue-600 rounded-t" style={{height: '150px'}}></div>
                <div className="w-16 bg-red-600 rounded-t" style={{height: '60px'}}></div>
                <div className="text-xs text-gray-400">Semana 2</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-blue-600 rounded-t" style={{height: '100px'}}></div>
                <div className="w-16 bg-red-600 rounded-t" style={{height: '90px'}}></div>
                <div className="text-xs text-gray-400">Semana 3</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-blue-600 rounded-t" style={{height: '180px'}}></div>
                <div className="w-16 bg-red-600 rounded-t" style={{height: '50px'}}></div>
                <div className="text-xs text-gray-400">Semana 4</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-blue-600 mr-1"></div>
                <span className="text-xs text-gray-400">Ingresos</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-600 mr-1"></div>
                <span className="text-xs text-gray-400">Gastos</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Ingresos Totales</div>
                <div className="text-lg font-bold text-blue-400">$1,450,000</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Gastos Totales</div>
                <div className="text-lg font-bold text-red-400">$520,000</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Beneficio Neto</div>
                <div className="text-lg font-bold text-green-400">$930,000</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Margen de Beneficio</div>
                <div className="text-lg font-bold text-green-400">64.1%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Asistencias por Día</CardTitle>
              <CardDescription className="text-gray-400">Actividad de miembros</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Gráfico simplificado de líneas */}
            <div className="h-64 relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="border-b border-dashed border-gray-700 h-0"></div>
                <div className="border-b border-dashed border-gray-700 h-0"></div>
                <div className="border-b border-dashed border-gray-700 h-0"></div>
                <div className="border-b border-dashed border-gray-700 h-0"></div>
              </div>
              
              <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                <polyline 
                  points="0,100 30,120 60,90 90,110 120,70 150,80 180,50 210,60 240,40 270,60 300,30" 
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              </svg>
              
              <div className="absolute bottom-0 w-full flex justify-between text-xs text-gray-400">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Total Asistencias</div>
                <div className="text-lg font-bold">632</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Promedio Diario</div>
                <div className="text-lg font-bold">22</div>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg">
                <div className="text-gray-400 text-xs">Día más Activo</div>
                <div className="text-lg font-bold">Lunes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Membresías Activas</CardTitle>
              <CardDescription className="text-gray-400">Distribución por tipo de plan</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Gráfico simplificado de dona */}
            <div className="flex justify-center py-4">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3B82F6" strokeWidth="10" strokeDasharray="188.5 282.7" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#8B5CF6" strokeWidth="10" strokeDasharray="94.2 282.7" strokeDashoffset="-188.5" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#EC4899" strokeWidth="10" strokeDasharray="47.1 282.7" strokeDashoffset="-94.2" />
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#10B981" strokeWidth="10" strokeDasharray="31.4 282.7" strokeDashoffset="-47.1" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 mr-2"></div>
                <div>
                  <div className="text-sm">Plan Básico</div>
                  <div className="text-xs text-gray-400">52 miembros (42%)</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-600 mr-2"></div>
                <div>
                  <div className="text-sm">Plan Trimestral</div>
                  <div className="text-xs text-gray-400">26 miembros (21%)</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pink-600 mr-2"></div>
                <div>
                  <div className="text-sm">Plan Semestral</div>
                  <div className="text-xs text-gray-400">13 miembros (10%)</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-600 mr-2"></div>
                <div>
                  <div className="text-sm">Plan Anual</div>
                  <div className="text-xs text-gray-400">33 miembros (27%)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Renovaciones y Bajas</CardTitle>
              <CardDescription className="text-gray-400">Retención de miembros</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-400 mb-1">Tasa de Renovación</div>
                <div className="text-3xl font-bold text-green-400">78%</div>
                <div className="text-xs text-green-400 mt-1">▲ 5% vs mes anterior</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-xs text-gray-400 mb-1">Tasa de Abandono</div>
                <div className="text-3xl font-bold text-red-400">22%</div>
                <div className="text-xs text-green-400 mt-1">▼ 3% vs mes anterior</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Renovaciones por Tipo de Plan</div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Plan Básico</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Plan Trimestral</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Plan Semestral</span>
                    <span>87%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-pink-600 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Plan Anual</span>
                    <span>92%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </div>
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
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="font-medium">Informe Financiero</TableCell>
                  <TableCell>Detalle completo de ingresos, gastos y balance</TableCell>
                  <TableCell>Abril 2025</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="font-medium">Asistencias</TableCell>
                  <TableCell>Registro completo de asistencias diarias</TableCell>
                  <TableCell>Abril 2025</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="font-medium">Membresías</TableCell>
                  <TableCell>Estado de membresías y renovaciones</TableCell>
                  <TableCell>Abril 2025</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-gray-700 hover:bg-gray-700">
                  <TableCell className="font-medium">Miembros</TableCell>
                  <TableCell>Listado completo de miembros activos</TableCell>
                  <TableCell>Actualizado</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
