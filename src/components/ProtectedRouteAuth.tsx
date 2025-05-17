import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteAuthProps {
  children: React.ReactNode;
}

const ProtectedRouteAuth: React.FC<ProtectedRouteAuthProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Muestra un indicador de carga mientras se verifica la autenticación
    return (
      <div className="h-screen flex items-center justify-center bg-[#1A1F2C]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Si no hay usuario autenticado, redirigir al inicio de sesión
    return <Navigate to="/login" replace />;
  }

  // Si hay un usuario autenticado, muestra el contenido protegido
  return <>{children}</>;
};

export default ProtectedRouteAuth;
