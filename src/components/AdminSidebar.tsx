
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, UserCircle, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { signOut, user } = useAuth();
  
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    await signOut();
  };
  
  // Función para determinar si un enlace está activo
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? "bg-blue-700 text-white" : "text-gray-300 hover:bg-blue-700 hover:text-white";
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Navigation items with routes and icons
  const navItems = [
    { name: "Dashboard", icon: "📊", path: '/dashboard' },
    { name: "Miembros", icon: "👤", path: '/members' },
    { name: "Membresías", icon: "🏋️", path: '/memberships' },
    { name: "Pagos", icon: "💰", path: '/payments' },
    { name: "Asistencias", icon: "📅", path: '/attendance' },
    { name: "Caja", icon: "💵", path: '/cashbox' },
    { name: "Reportes", icon: "📈", path: '/reports' },
    { name: "Configuración", icon: "⚙️", path: '/settings' },
  ];

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-2 left-2 z-50 text-white bg-blue-700 rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      
      <div 
        className={`${
          isMobile 
            ? `fixed left-0 top-0 z-40 h-full transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative'
          } w-56 bg-[#1A1F2C] border-r border-gray-800 h-screen flex flex-col`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-center">
          <h1 className="text-xl font-bold text-blue-400">GIMNASIO</h1>
        </div>
        
        <div className="py-2 flex-grow overflow-y-auto">
          {navItems.map((item) => (
            <div 
              key={item.name}
              className={`p-2 mx-2 my-1 rounded flex items-center ${isActive(item.path)} transition-colors duration-200 cursor-pointer`}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setIsOpen(false);
              }}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center mb-3">
            <UserCircle className="h-5 w-5 mr-2 text-gray-400" />
            <span className="text-gray-300">{user?.email || 'Administrador'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-2 text-gray-300 hover:bg-gray-800 rounded transition-colors duration-200"
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
