import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, ChevronLeft, ChevronRight, FileText, BarChart, UserCheck, CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from '@/hooks/use-toast';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { memberServices, attendanceServices, paymentServices, reportServices } from '@/services/supabaseService';
import { 
  LineChart, 
  Line, 
  BarChart as ReBarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

// Colores para los gráficos
const COLORS = ['#4F8EF6', '#22C55E', '#A855F7', '#F97316', '#9b87f5'];

export default function Reports() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Datos para los reportes
  const [revenueExpenseData, setRevenueExpenseData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  const [retentionData, setRetentionData] = useState([]);
  const [availableReports, setAvailableReports] = useState([]);

  // Gestión de períodos
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const date = new Date();
    return `${date.toLocaleString('es', { month: 'long' })} ${date.getFullYear()}`;
  });

  useEffect(() => {
    loadReportsData(currentDate);
  }, [currentDate]);

  const loadReportsData = async (date) => {
    try {
      setLoading(true);
      
      // Definir rango de fechas para el mes actual
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).toISOString();
      const lastDay = new Date(year, month + 1, 0).toISOString();
      
      // Actualizar período seleccionado
      setSelectedPeriod(`${date.toLocaleString('es', { month: 'long' })} ${year}`);
      
      // 1. Obtener datos de pagos para ingresos
      const payments = await paymentServices.getAll();
      const monthlyPayments = payments.filter(p => {
        const paymentDate = new Date(p.payment_date);
        return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
      });
      
      // Agrupar pagos por día para el gráfico de ingresos vs gastos
      const dailyRevenueMap = {};
      monthlyPayments.forEach(p => {
        const day = new Date(p.payment_date).getDate();
        if (dailyRevenueMap[day]) {
          dailyRevenueMap[day] += p.amount;
        } else {
          dailyRevenueMap[day] = p.amount;
        }
      });
      
      // Crear datos para el gráfico de ingresos vs gastos (asumimos gastos ficticios por ahora)
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const revenueExpense = [];
      
      for (let i = 1; i <= daysInMonth; i++) {
        const dayRevenue = dailyRevenueMap[i] || 0;
        // Gastos simulados (podría conectarse a una tabla real de gastos en el futuro)
        const dayExpense = Math.round(dayRevenue * 0.4 * (Math.random() * 0.5 + 0.75));
        
        revenueExpense.push({
          day: i,
          ingresos: dayRevenue,
          gastos: dayExpense
        });
      }
      setRevenueExpenseData(revenueExpense);
      
      // 2. Obtener datos de asistencias
      const attendances = await attendanceServices.getAll();
      const monthlyAttendances = attendances.filter(a => {
        const checkInDate = new Date(a.check_in);
        return checkInDate.getMonth() === month && checkInDate.getFullYear() === year;
      });
      
      // Agrupar asistencias por día de la semana
      const weekdayMap = {0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mie', 4: 'Jue', 5: 'Vie', 6: 'Sab'};
      const weekdayAttendance = Array(7).fill(0).map((_, i) => ({ 
        day: weekdayMap[i], 
        asistencias: 0 
      }));
      
      monthlyAttendances.forEach(a => {
        const weekday = new Date(a.check_in).getDay();
        weekdayAttendance[weekday].asistencias++;
      });
      setAttendanceData(weekdayAttendance);
      
      // 3. Obtener datos de membresías activas
      const members = await memberServices.getAll();
      const activeMembers = members.filter(m => m.status === 'active');
      
      // Agrupar por tipo de membresía
      const membershipTypes = {};
      activeMembers.forEach(m => {
        if (membershipTypes[m.membership_type]) {
          membershipTypes[m.membership_type]++;
        } else {
          membershipTypes[m.membership_type] = 1;
        }
      });
      
      const membershipPieData = Object.entries(membershipTypes).map(([name, value]) => ({
        name,
        value
      }));
      setMembershipData(membershipPieData);
      
      // 4. Datos de renovaciones y bajas (simulados por ahora)
      const sixMonthsAgo = new Date(year, month - 5, 1);
      const retentionStats = [];
      
      for (let i = 0; i < 6; i++) {
        const monthDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
        const monthName = monthDate.toLocaleString('es', { month: 'short' });
        
        // Aquí podríamos obtener datos reales de renovaciones y bajas
        // Por ahora usamos datos simulados
        const totalMembers = Math.floor(Math.random() * 30) + 50;
        const renewals = Math.floor(totalMembers * (0.7 + Math.random() * 0.2));
        const churns = totalMembers - renewals;
        
        retentionStats.push({
          month: monthName,
          renovaciones: renewals,
          bajas: churns
        });
      }
      setRetentionData(retentionStats);
      
      // 5. Lista de reportes disponibles para descargar
      setAvailableReports([
        {
          id: 'members-list',
          name: 'Lista de Miembros',
          description: 'Listado completo de miembros activos',
          period: selectedPeriod,
          data: activeMembers
        },
        {
          id: 'payments-summary',
          name: 'Resumen de Pagos',
          description: 'Detalles de todos los pagos del período',
          period: selectedPeriod,
          data: monthlyPayments
        },
        {
          id: 'attendance-report',
          name: 'Reporte de Asistencias',
          description: 'Análisis detallado de asistencias',
          period: selectedPeriod,
          data: monthlyAttendances
        }
      ]);
      
    } catch (error) {
      console.error("Error cargando datos de reportes:", error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de reportes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // No permitir seleccionar meses futuros
    if (nextMonth <= new Date()) {
      setCurrentDate(nextMonth);
    }
  };

  // Generar PDF para reportes
  const handleDownload = async (reportName, reportData) => {
    setLoading(true);
    try {
      // Obtener datos frescos de Supabase según el reporte
      let freshData = reportData;
      if (reportName === 'Lista de Miembros') {
        freshData = await memberServices.getAll();
      } else if (reportName === 'Resumen de Pagos') {
        freshData = await paymentServices.getAll();
      } else if (reportName === 'Reporte de Asistencias') {
        freshData = await attendanceServices.getAll();
      }
      if (!Array.isArray(freshData) || freshData.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay datos para exportar o los datos están mal formateados',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      // Validar que todos los objetos tengan las mismas keys
      const keys = Object.keys(freshData[0]);
      if (!keys.length) {
        toast({
          title: 'Error de datos',
          description: 'Los datos no tienen columnas válidas',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Reporte: ${reportName}`, 10, 10);
      doc.setFontSize(12);
      doc.text(`Período: ${selectedPeriod}`, 10, 20);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 10, 30);

      // Añadir tabla con datos según el tipo de reporte
      if (reportName === 'Ingresos vs Gastos') {
        const tableData = revenueExpenseData.map(item => [
          `Día ${item.day}`, 
          `$${item.ingresos.toLocaleString()}`, 
          `$${item.gastos.toLocaleString()}`
        ]);
        (doc as any).autoTable({
          startY: 40,
          head: [['Día', 'Ingresos', 'Gastos']],
          body: tableData,
        });
      } 
      else if (reportName === 'Asistencias por Día') {
        const tableData = attendanceData.map(item => [
          item.day, 
          item.asistencias.toString()
        ]);
        (doc as any).autoTable({
          startY: 40,
          head: [['Día', 'Asistencias']],
          body: tableData,
        });
      } 
      else if (reportName === 'Membresías Activas') {
        const tableData = membershipData.map(item => [
          item.name,
          Math.round(Number(item.value)).toString()
        ]);
        (doc as any).autoTable({
          startY: 40,
          head: [['Tipo de Membresía', 'Cantidad']],
          body: tableData,
        });
      } 
      else if (reportName === 'Renovaciones y Bajas') {
        const tableData = retentionData.map(item => [
          item.month,
          item.renovaciones.toString(),
          item.bajas.toString()
        ]);
        (doc as any).autoTable({
          startY: 40,
          head: [['Mes', 'Renovaciones', 'Bajas']],
          body: tableData,
        });
      } 
      else if (Array.isArray(freshData) && freshData.length > 0) {
        // Exportar cualquier otro reporte genérico
        const header = Object.keys(freshData[0]);
        const body = freshData.map(row => header.map(h => row[h]));
        (doc as any).autoTable({
          startY: 40,
          head: [header],
          body,
        });
      }
      doc.save(`${reportName.replace(/\s+/g, '_')}_${selectedPeriod.replace(/\s+/g, '_')}.pdf`);
      toast({
        title: 'Descarga exitosa',
        description: `${reportName} ha sido descargado correctamente`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error generando PDF. Revisa la consola para más detalles.',
        variant: 'destructive',
      });
      console.error("Error generando PDF:", error, { reportName, reportData });
    }
    setLoading(false);
  };

  const chartConfig = {
    members: { 
      label: "Miembros", 
      color: "#4F8EF6" 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Reportes</h1>
          <p className="text-gray-400">Análisis y estadísticas del negocio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-gray-600" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-white">{selectedPeriod}</span>
          <Button variant="outline" size="sm" className="border-gray-600" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#1A1F2C] border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ingresos vs Gastos</CardTitle>
              <CardDescription className="text-gray-400">Balance financiero mensual</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700" 
              onClick={() => handleDownload("Ingresos vs Gastos", null)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {revenueExpenseData.length > 0 ? (
              <div className="h-64">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueExpenseData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#999" />
                      <YAxis stroke="#999" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#4F8EF6"
                        name="Ingresos"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="gastos"
                        stroke="#F97316"
                        name="Gastos"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos disponibles para este período
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Asistencias por Día</CardTitle>
              <CardDescription className="text-gray-400">Actividad de miembros</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700" 
              onClick={() => handleDownload("Asistencias por Día", null)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {attendanceData.length > 0 ? (
              <div className="h-64">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={attendanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#999" />
                      <YAxis stroke="#999" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="asistencias"
                        fill="#22C55E"
                        name="Asistencias"
                        radius={[4, 4, 0, 0]}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos disponibles para este período
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Membresías Activas</CardTitle>
              <CardDescription className="text-gray-400">Distribución por tipo de plan</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700" 
              onClick={() => handleDownload("Membresías Activas", null)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {membershipData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {membershipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} miembros`, name]}
                      contentStyle={{ backgroundColor: '#222732', border: '1px solid #333' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom"
                      align="center"
                      formatter={(value) => <span style={{ color: '#999' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos disponibles para este período
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#1A1F2C] border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Renovaciones y Bajas</CardTitle>
              <CardDescription className="text-gray-400">Retención de miembros</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700" 
              onClick={() => handleDownload("Renovaciones y Bajas", null)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {retentionData.length > 0 ? (
              <div className="h-64">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={retentionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="month" stroke="#999" />
                      <YAxis stroke="#999" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="renovaciones"
                        fill="#22C55E"
                        name="Renovaciones"
                        stackId="a"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="bajas"
                        fill="#F97316"
                        name="Bajas"
                        stackId="a"
                        radius={[4, 4, 0, 0]}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No hay datos disponibles para este período
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1A1F2C] border-gray-700 text-white">
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
                <TableRow className="border-gray-700 hover:bg-[#1A1F2C]">
                  <TableHead className="text-gray-400">Tipo de Reporte</TableHead>
                  <TableHead className="text-gray-400">Descripción</TableHead>
                  <TableHead className="text-gray-400">Período</TableHead>
                  <TableHead className="text-gray-400 text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableReports.map((report, index) => (
                  <TableRow key={report.id} className="border-gray-700 hover:bg-[#222732]">
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center">
                        {report.id === 'members-list' ? (
                          <UserCheck className="mr-2 h-4 w-4 text-blue-400" />
                        ) : report.id === 'payments-summary' ? (
                          <CreditCard className="mr-2 h-4 w-4 text-green-400" />
                        ) : (
                          <BarChart className="mr-2 h-4 w-4 text-amber-400" />
                        )}
                        {report.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{report.description}</TableCell>
                    <TableCell className="text-gray-300">{report.period}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => handleDownload(report.name, report.data)}
                      >
                        <FileText className="mr-1 h-4 w-4" /> PDF
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
