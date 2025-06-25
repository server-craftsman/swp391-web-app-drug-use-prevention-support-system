import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";
import BlogMManagement from "../../../pages/admin/blog";
import CourseManagement from "../../../pages/admin/course";

// import page
const OverviewPage = lazy(() => import("../../../pages/admin/overview"));
const UserManagementPage = lazy(() => import("../../../pages/admin/user"));
const SettingManagementPage = lazy(
  () => import("../../../pages/admin/setting")
);

export const AdminRoutes: Record<string, RouteObject[]> = {
  [ROUTER_URL.ADMIN.BASE]: [
    {
      element: <OverviewPage />,
      index: true,
    },
    {
      element: <UserManagementPage />,
      path: ROUTER_URL.ADMIN.USERS,
    },
    {
      element: <SettingManagementPage />,
      path: ROUTER_URL.ADMIN.SETTINGS,
    },
    {
      element: <BlogMManagement />,
      path: ROUTER_URL.ADMIN.MANAGER_BLOG,
    },
    {
      element: <CourseManagement />,
      path: ROUTER_URL.ADMIN.MANAGER_COURSE,
    },
  ],
};
