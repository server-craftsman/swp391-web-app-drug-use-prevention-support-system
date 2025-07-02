import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

import CustomerLayout from "../../../layouts/customer/Customer.layout";
// Lazy load customer pages
const SettingsPage = lazy(() => import("../../../pages/client/settings"));

// Customer routes that require authentication
export const CustomerRoutes: RouteObject[] = [
  {
    path: ROUTER_URL.CUSTOMER.BASE,
    element: <CustomerLayout />,
    children: [
      {
        path: ROUTER_URL.CUSTOMER.SETTINGS,
        element: <SettingsPage />,
      },
    ],
  },
];
