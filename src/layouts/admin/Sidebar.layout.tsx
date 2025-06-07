// d:\CN8\SWP391\web-app\src\layouts\admin\Sidebar.layout.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTER_URL } from '../../consts/router.path.const';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { UserOutlined, SettingOutlined, DashboardOutlined } from '@ant-design/icons';

const navItems = [
  { name: 'Tổng Quan', to: ROUTER_URL.ADMIN.BASE, icon: <DashboardOutlined /> },
  { name: 'Quản Lý Tài Khoản', to: ROUTER_URL.ADMIN.USERS, icon: <UserOutlined /> },
  { name: 'Cài Đặt', to: ROUTER_URL.ADMIN.SETTINGS, icon: <SettingOutlined /> },
];

const SidebarLayout: React.FC = () => {
  return (
    <aside className="w-72 bg-[radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)] text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-neutral-700">
        <NavLink to={ROUTER_URL.COMMON.HOME} className="flex items-center space-x-3">
          <div className="mr-2">
            <div className="bg-primary rounded p-2 text-white font-bold transform hover:rotate-3 transition-transform">
              PDP
            </div>
          </div>
          <span className="text-2xl font-bold text-primary">
            Admin <span className="text-secondary">Panel</span>
          </span>
        </NavLink>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <NavLink
                to={item.to}
                end={item.to === ROUTER_URL.ADMIN.BASE}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center space-x-3 p-2 rounded-3xl transition-all duration-150 ease-in-out',
                    isActive
                      ? 'bg-primary text-[#fff]/100'
                      : 'hover:bg-primary/20 hover:shadow-lg text-neutral-500'
                  )
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-700 mt-auto">
        <p className="text-xs text-neutral-500 text-center">
          {new Date().getFullYear()} PDP
        </p>
      </div>
    </aside>
  );
};

export default SidebarLayout;