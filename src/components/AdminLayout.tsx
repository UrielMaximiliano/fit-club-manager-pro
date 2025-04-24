
import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen bg-[#1A1F2C]">
      <AdminSidebar />
      <div className={`flex-1 p-4 md:p-6 w-full ${isMobile ? 'overflow-x-hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
