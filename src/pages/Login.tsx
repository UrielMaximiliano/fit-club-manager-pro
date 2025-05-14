
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, KeyRound } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'El correo electrónico es inválido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading } = useAuth();
  const isMobile = useIsMobile();

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-blue-400">WALTER RECALDE</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">SKEREER</p>
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
