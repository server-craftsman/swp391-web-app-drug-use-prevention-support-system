import React from 'react';
import SidebarLayout from './Sidebar.layout'; // Import the SidebarLayout
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <SidebarLayout />
        <main className="flex-grow p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;