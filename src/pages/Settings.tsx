import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { supabase } from '../lib/supabase';

const Settings = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar el perfil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({ title: 'Error', description: 'Completa ambos campos de contraseña.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Las contraseñas no coinciden.', variant: 'destructive' });
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: 'Éxito', description: 'Contraseña actualizada correctamente.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'No se pudo cambiar la contraseña', variant: 'destructive' });
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
          <form onSubmit={handleChangePassword} className="grid gap-2 mt-4">
            <label className="block text-sm font-medium leading-none">Nueva Contraseña</label>
            <Input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              className="mt-1"
            />
            <label className="block text-sm font-medium leading-none">Confirmar Contraseña</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="mt-1"
            />
            <Button type="submit" className="mt-2">Cambiar Contraseña</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
