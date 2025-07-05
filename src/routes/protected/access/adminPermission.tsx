import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// Admin pages
import BlogManagement from "../../../pages/admin/blog";
import CourseManagement from "../../../pages/admin/course";
import UserManagement from "../../../pages/admin/user";
import StaffConsultantManagement from "../../../pages/admin/staff";
import ManagerManagement from "../../../pages/admin/manager";
import CategoryManagement from "../../../pages/admin/category";

// Lazy load admin pages
const AdminLayout = lazy(() => import("../../../layouts/admin/Admin.layout"));
const OverviewPage = lazy(() => import("../../../pages/admin/overview"));
const SettingsPage = lazy(() => import("../../../pages/client/settings"));
const ProgramManagementPage = lazy(
  () => import("../../../pages/manager/program")
);

// Admin routes with layout protection
export const AdminRoutes: RouteObject[] = [
  {
    path: ROUTER_URL.ADMIN.BASE,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: ROUTER_URL.ADMIN.USERS,
        element: <UserManagement />,
      },
      {
        path: ROUTER_URL.ADMIN.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: ROUTER_URL.ADMIN.MANAGER_BLOG,
        element: <BlogManagement />,
      },
      {
        path: ROUTER_URL.ADMIN.MANAGER_COURSE,
        element: <CourseManagement />,
      },
      {
        path: ROUTER_URL.ADMIN.MANAGER_USER,
        element: <UserManagement />,
      },
      {
        path: ROUTER_URL.ADMIN.STAFF_CONSULTANTS,
        element: <StaffConsultantManagement />,
      },
      {
        path: ROUTER_URL.ADMIN.MANAGERS,
        element: <ManagerManagement />,
      },
      {
        path: ROUTER_URL.ADMIN.COMMUNITY_PROGRAMS,
        element: <ProgramManagementPage />,
      },
      {
        path: ROUTER_URL.ADMIN.MANAGER_CATEGORY,
        element: <CategoryManagement />,
      },
    ],
  },
];
