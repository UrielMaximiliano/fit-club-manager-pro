import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, UserCircle, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  const handleLogout = () => {
    // Eliminamos la sesión
    localStorage.removeItem('gimnasio-admin-logged');
    
    // Mostramos mensaje de éxito
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
    
    // Redirigimos al login
    navigate('/login');
  };
  
  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-blue-700";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 text-white"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      <div className={`${
        isMobile 
          ? `fixed left-0 top-0 z-40 h-full transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
        } w-56 bg-[#1A1F2C] border-r border-gray-800 h-screen flex flex-col`}
      >
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-blue-400">GIMNASIO</h1>
        </div>
        
        <div className="py-2 flex-grow overflow-y-auto">
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/routines')}`}>
            <span className="mr-2">👤</span>
            <span className="cursor-pointer" onClick={() => navigate('/routines')}>Miembros</span>
          </div>
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/memberships')}`}>
            <span className="mr-2">🏋️</span>
            <span className="cursor-pointer" onClick={() => navigate('/memberships')}>Membresías</span>
          </div>
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/payments')}`}>
            <span className="mr-2">💰</span>
            <span className="cursor-pointer" onClick={() => navigate('/payments')}>Pagos</span>
          </div>
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/attendance')}`}>
            <span className="mr-2">📅</span>
            <span className="cursor-pointer" onClick={() => navigate('/attendance')}>Asistencias</span>
          </div>
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/cashbox')}`}>
            <span className="mr-2">💵</span>
            <span className="cursor-pointer" onClick={() => navigate('/cashbox')}>Caja</span>
          </div>
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/reports')}`}>
            <span className="mr-2">📈</span>
            <span className="cursor-pointer" onClick={() => navigate('/reports')}>Reportes</span>
          </div>
          <div className={`p-2 mx-2 rounded flex items-center ${isActive('/settings')}`}>
            <span className="mr-2">⚙️</span>
            <span className="cursor-pointer" onClick={() => navigate('/settings')}>Configuración</span>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center mb-3">
            <UserCircle className="h-5 w-5 mr-2 text-gray-400" />
            <span className="text-gray-300">Administrador</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-300 hover:bg-gray-800 rounded"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
      
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
