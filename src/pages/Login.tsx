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
import { useToast } from '@/components/ui/use-toast';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'El nombre de usuario es requerido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const defaultAdmin = {
    username: 'admin',
    password: 'admin123'
  };

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (data.username === defaultAdmin.username && data.password === defaultAdmin.password) {
        toast({
          title: "Acceso exitoso",
          description: "Bienvenido al sistema de administración",
        });
        localStorage.setItem('gimnasio-admin-logged', 'true');
        navigate('/routines');
      } else {
        toast({
          variant: "destructive",
          title: "Error de acceso",
          description: "Usuario o contraseña incorrectos",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-blue-400">GIMNASIO</h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">Sistema de Administración</p>
        </div>
        
        <Card className="bg-[#222732] border-gray-700 shadow-lg">
          <CardHeader className="space-y-1 px-4 md:px-6">
            <CardTitle className="text-xl md:text-2xl font-bold text-center text-white">Iniciar Sesión</CardTitle>
            <CardDescription className="text-sm md:text-base text-center text-gray-400">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Usuario</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Input 
                            className="pl-9 bg-[#1A1F2C] border-gray-700 text-white" 
                            placeholder="Ingresa tu nombre de usuario" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
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
                            className="pl-9 bg-[#1A1F2C] border-gray-700 text-white" 
                            type="password" 
                            placeholder="Ingresa tu contraseña" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col text-center text-xs text-gray-500 px-4 md:px-6">
            <p>Para este prototipo, usa: admin / admin123</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
