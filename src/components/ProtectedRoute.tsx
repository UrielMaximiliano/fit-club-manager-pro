
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { toast } = useToast();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('gimnasio-admin-logged') === 'true';
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Acceso restringido",
        description: "Debes iniciar sesión para acceder a esta sección",
      });
    }
  }, [isAuthenticated, toast]);
  
  if (!isAuthenticated) {
    // Redireccionamos al login y guardamos la ruta que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
