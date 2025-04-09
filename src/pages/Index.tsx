
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // Verificamos si ya está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('gimnasio-admin-logged') === 'true';
    if (isAuthenticated) {
      navigate('/routines');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#1A1F2C]">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-400 mb-4">Sistema de Gestión de Gimnasio</h1>
            <p className="text-xl text-gray-400">Administra tus miembros, rutinas y más.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-[#222732] border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-white">Administración de Miembros</CardTitle>
                <CardDescription className="text-gray-400">Registrar, actualizar y seguir miembros del gimnasio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Perfiles completos de miembros con información personal, detalles de membresía e historial de pagos.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/login">
                    Acceder a Miembros <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-[#222732] border-gray-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-white">Rutinas de Ejercicio</CardTitle>
                <CardDescription className="text-gray-400">Ver y administrar rutinas semanales de ejercicio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Accede y modifica rutinas personalizadas de entrenamiento para cada estudiante organizadas por día de la semana.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/login">
                    Ver Rutinas <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900">
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" /> Iniciar sesión como administrador
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
