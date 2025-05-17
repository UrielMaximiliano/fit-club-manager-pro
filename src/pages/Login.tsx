import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, KeyRound } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const loginSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico es inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const isMobile = useIsMobile();
  const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ email: '', password: '', gymName: '' });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await signIn(data.email, data.password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    setRegisterLoading(true);
    // Validar nombre de gimnasio único
    const { data: gyms, error: gymError } = await supabase
      .from('clientes')
      .select('id')
      .eq('nombre', registerData.gymName);
    if (gymError) {
      setRegisterError('Error al validar el nombre del gimnasio.');
      setRegisterLoading(false);
      return;
    }
    if (gyms && gyms.length > 0) {
      setRegisterError('El nombre del gimnasio ya está en uso.');
      setRegisterLoading(false);
      return;
    }
    // Crear usuario en Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
    });
    if (signUpError) {
      setRegisterError(signUpError.message);
      setRegisterLoading(false);
      return;
    }
    // Crear registro en clientes
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .insert({ nombre: registerData.gymName, email: registerData.email })
      .select('id')
      .single();
    if (clienteError) {
      setRegisterError('Error al crear el gimnasio.');
      setRegisterLoading(false);
      return;
    }
    // Guardar cliente_id en el perfil del usuario
    const userId = signUpData.user?.id;
    if (userId && cliente?.id) {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { cliente_id: cliente.id },
      });
    }
    setRegisterSuccess('Registro exitoso. Revisa tu email para confirmar tu cuenta.');
    setRegisterLoading(false);
  };

  if (showRegister) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#18181b]">
        <form onSubmit={handleRegister} className="bg-[#232329] p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-white mb-2">Registro de Gimnasio</h2>
          <input
            type="text"
            placeholder="Nombre del gimnasio"
            className="w-full p-2 rounded bg-[#18181b] border border-gray-700 text-white"
            value={registerData.gymName}
            onChange={e => setRegisterData({ ...registerData, gymName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 rounded bg-[#18181b] border border-gray-700 text-white"
            value={registerData.email}
            onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-2 rounded bg-[#18181b] border border-gray-700 text-white"
            value={registerData.password}
            onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
            required
          />
          {registerError && <div className="text-red-400 text-sm">{registerError}</div>}
          {registerSuccess && <div className="text-green-400 text-sm">{registerSuccess}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mt-2"
            disabled={registerLoading}
          >
            {registerLoading ? 'Registrando...' : 'Registrarse'}
          </button>
          <button
            type="button"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white rounded-lg py-2 mt-2"
            onClick={() => setShowRegister(false)}
          >
            Volver al login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-blue-400">GIMNASIO</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">Login</p>
        </div>
        
        <Card className="bg-[#222732] border-gray-700 shadow-lg">
          <CardHeader className="space-y-1 p-4 md:p-6">
            <CardTitle className="text-lg md:text-2xl font-bold text-center text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-sm md:text-base text-center text-gray-400">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Correo electrónico</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input 
                            className="pl-9 bg-[#1A1F2C] border-gray-700 text-white h-10" 
                            placeholder="Ingresa tu correo electrónico" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input 
                            className="pl-9 bg-[#1A1F2C] border-gray-700 text-white h-10" 
                            type="password" 
                            placeholder="Ingresa tu contraseña" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-2" 
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </Form>
            <button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mt-2"
              onClick={() => setShowRegister(true)}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </CardContent>
          <CardFooter className="flex flex-col text-center text-xs text-gray-500 px-4 md:px-6 py-3">
            <p>Para probar, crea un usuario en Supabase o usa las credenciales provistas.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
