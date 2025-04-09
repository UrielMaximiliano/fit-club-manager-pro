
import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#1A1F2C]">
      <AdminSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
