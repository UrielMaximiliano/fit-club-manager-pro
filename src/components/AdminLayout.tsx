
import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-[#1A1F2C] w-full">
      <AdminSidebar />
      <div className={`flex-1 p-2 md:p-6 w-full ${isMobile ? 'ml-0 overflow-x-hidden' : ''}`}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
