import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/services/supabaseService';

export default function Settings() {
  const { toast } = useToast();
  const [gymName, setGymName] = useState("Gimnasio FitLife");
  const [address, setAddress] = useState("Av. Principal 123, Ciudad");
  const [phone, setPhone] = useState("+56 9 1234 5678");
  const [email, setEmail] = useState("contacto@fitlifegym.cl");
  const [clearing, setClearing] = useState(false);
  
  const handleSaveGeneralInfo = () => {
    toast({
      title: "Información actualizada",
      description: "Los datos generales se han guardado correctamente",
    });
  };
  
  const handleSavePassword = () => {
    toast({
      title: "Contraseña actualizada",
      description: "La contraseña se ha cambiado correctamente",
    });
  };
  
  const handleBackupDatabase = () => {
    toast({
      title: "Copia de seguridad iniciada",
      description: "Se está generando la copia de seguridad de los datos",
    });
  };
  
  const handleClearData = async () => {
    if (!window.confirm('¿Estás seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) return;
    setClearing(true);
    try {
      // Borra primero las tablas dependientes
      const { error: errA } = await supabase.from('attendance').delete().not('id', 'is', null);
      const { error: errP } = await supabase.from('payments').delete().not('id', 'is', null);
      // const { error: errR } = await supabase.from('routines').delete().not('id', 'is', null); // Eliminado porque la tabla no existe
      const { error: errC } = await supabase.from('cashbox').delete().not('id', 'is', null);
      // Luego borra membresías y miembros
      const { error: errMship } = await supabase.from('memberships').delete().not('id', 'is', null);
      const { error: errM } = await supabase.from('members').delete().not('id', 'is', null);
      if (errA || errP || errC || errMship || errM) {
        console.error('Error al borrar:', { errA, errP, errC, errMship, errM });
        throw new Error('Error al borrar datos');
      }
      toast({
        title: 'Datos borrados',
        description: 'Todos los datos han sido eliminados correctamente.',
        variant: 'default',
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al borrar los datos.',
        variant: 'destructive',
      });
      console.error(e);
    } finally {
      setClearing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400">Administra los ajustes del sistema</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription className="text-gray-400">Datos básicos del gimnasio</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gymName">Nombre del Gimnasio</Label>
                <Input 
                  id="gymName"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input 
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input 
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Button 
                className="mt-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                onClick={handleSaveGeneralInfo}
              >
                Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Seguridad</CardTitle>
            <CardDescription className="text-gray-400">Actualiza tus credenciales</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input 
                  id="currentPassword"
                  type="password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input 
                  id="newPassword"
                  type="password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Button 
                className="mt-2 bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                onClick={handleSavePassword}
              >
                Actualizar Contraseña
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white md:col-span-2">
          <CardHeader>
            <CardTitle>Copia de Seguridad</CardTitle>
            <CardDescription className="text-gray-400">Gestiona los respaldos de tus datos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">Base de Datos</h3>
                    <p className="text-sm text-gray-400">Última copia: 29/04/2025, 14:30</p>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleBackupDatabase}
                  >
                    Crear Copia de Seguridad
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">Restaurar Sistema</h3>
                    <p className="text-sm text-gray-400">Restaura el sistema a un punto anterior</p>
                  </div>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    Seleccionar Respaldo
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium">Borrar Datos</h3>
                    <p className="text-sm text-gray-400">Eliminar información antigua del sistema</p>
                  </div>
                  <Button variant="destructive" onClick={handleClearData} disabled={clearing}>
                    {clearing ? 'Borrando...' : 'Limpiar Datos'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700 text-white md:col-span-2">
          <CardHeader>
            <CardTitle>Sobre el Sistema</CardTitle>
            <CardDescription className="text-gray-400">Información técnica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Versión del Sistema</div>
                <div className="font-medium mt-1">v1.0.4</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Última Actualización</div>
                <div className="font-medium mt-1">30/04/2025</div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Almacenamiento</div>
                <div className="font-medium mt-1">45% ocupado</div>
                <div className="w-full h-2 bg-gray-600 rounded-full mt-2">
                  <div className="h-2 bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                Buscar Actualizaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
