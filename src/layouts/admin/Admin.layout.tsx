import React from 'react';
import SidebarLayout from './Sidebar.layout'; // Import the SidebarLayout
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarLayout />
      <main className="flex-grow p-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;