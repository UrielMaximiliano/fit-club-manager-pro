
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';
import { cashboxServices, CashboxTransaction } from '@/services';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Cashbox() {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCloseCashbox, setShowCloseCashbox] = useState(false);
  const [transactions, setTransactions] = useState<CashboxTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formDate, setFormDate] = useState("");
  const [formConcept, setFormConcept] = useState("");
  const [formAmount, setFormAmount] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await cashboxServices.getAll();
      setTransactions(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las transacciones',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  const handleOpenIncomeForm = () => {
    setShowIncomeForm(true);
    setShowExpenseForm(false);
    setShowCloseCashbox(false);
  };

  const handleOpenExpenseForm = () => {
    setShowIncomeForm(false);
    setShowExpenseForm(true);
    setShowCloseCashbox(false);
  };

  const handleOpenCloseCashbox = () => {
    setShowIncomeForm(false);
    setShowExpenseForm(false);
    setShowCloseCashbox(true);
  };

  const handleFormSubmit = async () => {
    if (!formDate || !formConcept || !formAmount) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    try {
      await cashboxServices.create({
        date: formDate,
        concept: formConcept,
        type: showIncomeForm ? "Ingreso" : "Gasto",
        amount: Number(formAmount),
      });
      toast({ title: 'Transacción registrada', description: 'Se ha registrado correctamente.' });
      loadTransactions();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo registrar la transacción', variant: 'destructive' });
    }
    setShowIncomeForm(false);
    setShowExpenseForm(false);
    setFormDate("");
    setFormConcept("");
    setFormAmount("");
  };

  const handleCloseCashbox = async () => {
    setShowCloseCashbox(false);
    try {
      await cashboxServices.create({
        date: new Date().toISOString().split('T')[0],
        concept: "Cierre de Caja",
        type: "Cierre",
        amount: 0,
      });
      toast({ title: 'Cierre de caja registrado', description: 'Se ha registrado el cierre de caja.' });
      loadTransactions();
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo registrar el cierre de caja', variant: 'destructive' });
    }
  };

  // Generate PDF for cash flow
  const handleDownloadCashFlow = async () => {
    setLoading(true);
    try {
      const freshTransactions = await cashboxServices.getAll();
      if (!freshTransactions || freshTransactions.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay transacciones para exportar',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Flujo de Efectivo - Abril 2025', 10, 10);
      doc.setFontSize(12);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 10, 20);
      // Tabla de transacciones
      const tableData = freshTransactions.map(t => [
        t.id,
        t.date,
        t.concept,
        t.type,
        `$${t.amount.toLocaleString()}`
      ]);
      (doc as any).autoTable({
        startY: 30,
        head: [['ID', 'Fecha', 'Concepto', 'Tipo', 'Monto']],
        body: tableData,
      });
      doc.save('Flujo_de_Efectivo_Abril_2025.pdf');
      toast({
        title: 'Descarga exitosa',
        description: 'PDF de flujo de efectivo descargado correctamente',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo descargar el PDF',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  // Filter transactions by search term
  const filteredTransactions = transactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.amount.toString().includes(searchTerm)
  );

  // Preparar datos para el gráfico de flujo de efectivo
  const cashFlowChartData = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    // Agrupar por fecha y sumar ingresos/gastos
    const grouped: Record<string, { date: string; Ingreso: number; Gasto: number }> = {};
    transactions.forEach(t => {
      if (!grouped[t.date]) grouped[t.date] = { date: t.date, Ingreso: 0, Gasto: 0 };
      if (t.type === 'Ingreso') grouped[t.date].Ingreso += Number(t.amount);
      if (t.type === 'Gasto') grouped[t.date].Gasto += Number(t.amount);
    });
    // Ordenar por fecha ascendente
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Caja</h1>
          <p className="text-gray-400">Administración de ingresos y gastos</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-950" onClick={handleOpenIncomeForm}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Registrar Ingreso
          </Button>
          <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-950" onClick={handleOpenExpenseForm}>
            <ArrowUp className="mr-2 h-4 w-4" />
            Registrar Gasto
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleOpenCloseCashbox}>
            <Calendar className="mr-2 h-4 w-4" />
            Cierre de Caja
          </Button>
        </div>
      </div>

      {showIncomeForm && (
        <Card className="bg-gray-800 border-gray-700 text-white p-4">
          <CardHeader>
            <CardTitle>Registrar Ingreso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
              <div className="mb-2">
                <label>Fecha:</label>
                <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required className="bg-black text-white" />
              </div>
              <div className="mb-2">
                <label>Concepto:</label>
                <Input type="text" value={formConcept} onChange={(e) => setFormConcept(e.target.value)} required className="bg-black text-white" />
              </div>
              <div className="mb-2">
                <label>Monto:</label>
                <Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required className="bg-black text-white" />
              </div>
              <Button type="submit" className="mt-2">Registrar</Button>
              <Button variant="ghost" className="mt-2 ml-2" onClick={() => setShowIncomeForm(false)}>Cancelar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showExpenseForm && (
        <Card className="bg-gray-800 border-gray-700 text-white p-4">
          <CardHeader>
            <CardTitle>Registrar Gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
              <div className="mb-2">
                <label>Fecha:</label>
                <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required className="bg-black text-white" />
              </div>
              <div className="mb-2">
                <label>Concepto:</label>
                <Input type="text" value={formConcept} onChange={(e) => setFormConcept(e.target.value)} required className="bg-black text-white" />
              </div>
              <div className="mb-2">
                <label>Monto:</label>
                <Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} required className="bg-black text-white" />
              </div>
              <Button type="submit" className="mt-2">Registrar</Button>
              <Button variant="ghost" className="mt-2 ml-2" onClick={() => setShowExpenseForm(false)}>Cancelar</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {showCloseCashbox && (
        <Card className="bg-gray-800 border-gray-700 text-white p-4">
          <CardHeader>
            <CardTitle>Cierre de Caja</CardTitle>
          </CardHeader>
          <CardContent>
            <p>¿Está seguro que desea realizar el cierre de caja?</p>
            <div className="mt-4">
              <Button onClick={handleCloseCashbox} className="mr-2">Confirmar</Button>
              <Button variant="ghost" onClick={() => setShowCloseCashbox(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Resumen de Caja</CardTitle>
          <CardDescription className="text-gray-400">Estado actual de la caja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* No sample data */}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Flujo de Efectivo</h3>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={handleDownloadCashFlow}>
                Descargar Flujo de Efectivo
              </Button>
            </div>
            {cashFlowChartData.length > 0 ? (
              <div className="w-full h-48 bg-gray-700 rounded-lg p-2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowChartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#ccc" fontSize={12} />
                    <YAxis stroke="#ccc" fontSize={12} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="Ingreso" fill="#22C55E" name="Ingresos" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Gasto" fill="#EF4444" name="Gastos" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-700 rounded-lg p-2 flex items-center justify-center text-gray-500">
                Gráfico no disponible - Sin datos
              </div>
            )}
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar transacción..."
              className="pl-8 bg-gray-700 border-gray-600 text-gray-300 placeholder:text-gray-400"
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
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700 hover:bg-gray-700">
                    <TableCell className="font-medium text-white">{transaction.id}</TableCell>
                    <TableCell className="text-white">{transaction.date}</TableCell>
                    <TableCell className="text-white">{transaction.concept}</TableCell>
                    <TableCell>
                      {transaction.type === "Ingreso" ? (
                        <span className="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300">
                          Ingreso
                        </span>
                      ) : transaction.type === "Gasto" ? (
                        <span className="px-2 py-1 rounded text-xs bg-red-900 text-red-300">
                          Gasto
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-xs bg-gray-900 text-gray-300">
                          {transaction.type}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={transaction.type === "Ingreso" ? "text-blue-400" : "text-red-400"}>
                      ${transaction.amount.toLocaleString()}
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
