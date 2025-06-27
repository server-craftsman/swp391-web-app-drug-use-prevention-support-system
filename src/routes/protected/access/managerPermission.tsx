import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// Lazy load manager pages
const ManagerLayout = lazy(() => import("../../../layouts/manager/Manager.layout"));
const OverviewPage = lazy(() => import("../../../pages/admin/overview")); // Temporary, use admin overview
const SettingsPage = lazy(() => import("../../../pages/client/settings"));

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
                path: "analytics",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "staff",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "consultants",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "programs",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "courses",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "reports",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "compliance",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "operations",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "schedule",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "reviews",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.MANAGER.SETTINGS,
                element: <SettingsPage />,
            },
        ],
    },
]; 