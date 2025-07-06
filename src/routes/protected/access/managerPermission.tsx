import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// Lazy load manager pages
import StaffConsultantManagement from "../../../pages/admin/staff";
const ManagerLayout = lazy(() => import("../../../layouts/manager/Manager.layout"));
const OverviewPage = lazy(() => import("../../../pages/admin/overview")); // Temporary, use admin overview
const SettingsPage = lazy(() => import("../../../pages/client/settings"));
const ProgramManagementPage = lazy(() => import("../../../pages/manager/program"));
const AppointmentManagementPage = lazy(() => import("../../../pages/customer/appointment"));
// Manager routes with layout protection
export const ManagerRoutes: RouteObject[] = [
    {
        path: ROUTER_URL.MANAGER.BASE,
        element: <ManagerLayout />,
        children: [
            {
                index: true,
                element: <OverviewPage />,
            },
            {
                path: ROUTER_URL.MANAGER.ANALYTICS,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.USERS,
                element: <StaffConsultantManagement />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.CONSULTANTS,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.PROGRAMS,
                element: <ProgramManagementPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.COURSES,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.REPORTS,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.COMPLIANCE,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.OPERATIONS,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.SCHEDULE,
                element: <AppointmentManagementPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.REVIEWS,
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.SETTINGS,
                element: <SettingsPage />,
            },
        ],
    },
]; 