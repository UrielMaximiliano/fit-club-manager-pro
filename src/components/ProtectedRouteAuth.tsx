import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteAuthProps {
  children: React.ReactNode;
}

const ProtectedRouteAuth: React.FC<ProtectedRouteAuthProps> = ({ children }) => {
  const { user, loading, clienteId } = useAuth(); // Added clienteId

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

  // New check for clienteId
  if (!clienteId) {
    console.error("User authenticated but clienteId is missing. Redirecting to login.");
    return <Navigate to="/login?error=missing_tenant_id" replace />;
  }

  // Si hay un usuario autenticado, muestra el contenido protegido
  return <>{children}</>;
};

export default ProtectedRouteAuth;
