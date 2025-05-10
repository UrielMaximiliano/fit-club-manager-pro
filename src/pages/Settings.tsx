import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/services';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile(user);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el perfil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (newEmail: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Éxito',
        description: 'Correo electrónico actualizado correctamente. Por favor, verifica tu nuevo correo para confirmar el cambio.',
      });
      fetchProfile(); // Recargar el perfil para mostrar el nuevo correo
    } catch (error) {
      toast({
        title: 'Error',
        description: `No se pudo actualizar el correo electrónico: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Éxito',
        description: 'Se ha enviado un enlace para cambiar tu contraseña a tu correo electrónico.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `No se pudo enviar el enlace para cambiar la contraseña: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>

      <Card>
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
          <CardDescription>Aquí puedes ver y actualizar tu información de perfil.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label className="block text-sm font-medium leading-none">Correo Electrónico</label>
            <Input
              type="email"
              value={profile?.email || ''}
              disabled
              className="mt-1"
            />
          </div>
          <div>
            <Button onClick={handleChangePassword}>Cambiar Contraseña</Button>
          </div>
          {/* <div>
            <label className="block text-sm font-medium leading-none">Nuevo Correo Electrónico</label>
            <Input
              type="email"
              placeholder="nuevo@correo.com"
              className="mt-1"
            />
            <Button onClick={() => handleUpdateEmail('nuevo@correo.com')}>Actualizar Correo</Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
