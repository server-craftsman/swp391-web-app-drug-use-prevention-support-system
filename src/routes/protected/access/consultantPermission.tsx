import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// Lazy load consultant pages
const ConsultantLayout = lazy(() => import("../../../layouts/consultant/Consultant.layout"));
const OverviewPage = lazy(() => import("../../../pages/admin/overview")); // Temporary, use admin overview
const SettingsPage = lazy(() => import("../../../pages/client/settings"));
const AppointmentPage = lazy(() => import("../../../pages/customer/appointment"));
// Consultant routes with layout protection
export const ConsultantRoutes: RouteObject[] = [
    {
        path: ROUTER_URL.CONSULTANT.BASE,
        element: <ConsultantLayout />,
        children: [
            {
                index: true,
                element: <OverviewPage />,
            },
            {
                path: ROUTER_URL.CONSULTANT.APPOINTMENTS,
                element: <AppointmentPage />, // Temporary placeholder
            },
            {
                path: "clients",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "consultations",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "assessments",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "resources",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: "reports",
                element: <OverviewPage />, // Temporary placeholder
            },
            {
                path: ROUTER_URL.CONSULTANT.SETTINGS,
                element: <SettingsPage />,
            },
        ],
    },
]; 