import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// Lazy load staff pages
const StaffLayout = lazy(() => import("../../../layouts/staff/Staff.layout"));
const OverviewPage = lazy(() => import("../../../pages/admin/overview")); // Temporary, use admin overview
const SettingsPage = lazy(() => import("../../../pages/client/settings"));

// Staff routes with layout protection
export const StaffRoutes: RouteObject[] = [
    {
        path: ROUTER_URL.STAFF.BASE,
        element: <StaffLayout />,
        children: [
            {
                index: true,
                element: <OverviewPage />,
            },
            {
                path: "courses",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "content",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "community-programs",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "assessments",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "events",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "resources",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "users",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "reports",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.STAFF.SETTINGS,
                element: <SettingsPage />,
            },
        ],
    },
]; 