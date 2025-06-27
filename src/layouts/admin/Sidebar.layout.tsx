import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { cn } from "../../utils/cn";

const navItems = [
  { name: "Tổng Quan", to: ROUTER_URL.ADMIN.BASE, icon: <DashboardOutlined /> },
  {
    name: "Quản Lý Tài Khoản",
    to: ROUTER_URL.ADMIN.USERS,
    icon: <UserOutlined />,
  },
  { name: "Cài Đặt", to: ROUTER_URL.ADMIN.SETTINGS, icon: <SettingOutlined /> },
  {
    name: "Quản Lý Blog",
    to: ROUTER_URL.ADMIN.MANAGER_BLOG,
    icon: <SettingOutlined />,
  },
  {
    name: "Quản Lý Khóa Học",
    to: ROUTER_URL.ADMIN.MANAGER_COURSE,
    icon: <SettingOutlined />,
  },
  {
    name: "Quản Lý Người Dùng",
    to: ROUTER_URL.ADMIN.MANAGER_USER,
    icon: <SettingOutlined />,
  },
];

const SidebarLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <motion.aside
      className={cn(
        "bg-[radial-gradient(rgba(255,255,255,0.15) 1px,transparent 1px)] text-white flex flex-col min-h-screen relative transition-all duration-300 ease-in-out border-r border-neutral-200",
        collapsed ? "w-16" : "w-72"
      )}
      animate={{ width: collapsed ? "4rem" : "18rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md border border-gray-200 text-primary hover:text-secondary transition-colors z-10"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      <div
        className={cn(
          "p-6 border-b border-neutral-200 flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <NavLink
          to={ROUTER_URL.COMMON.HOME}
          className="flex items-center space-x-3"
        >
          <div className="flex-shrink-0">
            <div className="bg-primary rounded p-2 text-white font-bold transform hover:rotate-3 transition-transform">
              PDP
            </div>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="text-2xl font-bold text-primary whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Admin <span className="text-secondary">Panel</span>
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ x: collapsed ? 0 : 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {collapsed ? (
                <Tooltip title={item.name} placement="right">
                  <NavLink
                    to={item.to}
                    end={item.to === ROUTER_URL.ADMIN.BASE}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center justify-center p-2 rounded-full transition-all duration-150 ease-in-out",
                        isActive
                          ? "bg-primary text-white"
                          : "hover:bg-primary/20 hover:shadow-lg text-neutral-500"
                      )
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                  </NavLink>
                </Tooltip>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === ROUTER_URL.ADMIN.BASE}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center space-x-3 p-2 rounded-3xl transition-all duration-150 ease-in-out",
                      isActive
                        ? "bg-primary text-[#fff]/100"
                        : "hover:bg-primary/20 hover:shadow-lg text-neutral-500"
                    )
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <div
        className={cn(
          "p-4 border-t border-neutral-200 mt-auto",
          collapsed ? "text-center" : ""
        )}
      >
        <p className="text-xs text-neutral-500">
          {new Date().getFullYear()} PDP
        </p>
      </div>
    </motion.aside>
  );
};

export default SidebarLayout;
