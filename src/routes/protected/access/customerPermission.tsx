import { lazy } from "react";
import { ROUTER_URL } from "../../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

import CustomerLayout from "../../../layouts/customer/Customer.layout";
import MyCoursePage from "../../../pages/customer/my-course";
import OrderHistory from "../../../pages/customer/order";
import ReviewHistory from "../../../pages/customer/review";
import MyCourseDetail from "../../../components/customer/my-course/MyCourseDetail.com";
import LessonDetailPage from "../../../pages/customer/lesson";
import AppointmentDetail from "../../../components/customer/appointment/Detail.com";
// Lazy load customer pages
const SettingsPage = lazy(() => import("../../../pages/client/settings"));
const AppointmentPage = lazy(
  () => import("../../../pages/customer/appointment")
);

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
      {
        path: ROUTER_URL.CUSTOMER.APPOINTMENTS,
        element: <AppointmentPage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.APPOINTMENT_DETAIL,
        element: <AppointmentDetail />,
      },
      {
        path: ROUTER_URL.CUSTOMER.SETTINGS,
        element: <SettingsPage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.MY_COURSE,
        element: <MyCoursePage />,
      },
      {
        path: ROUTER_URL.CUSTOMER.ORDER_HISTORY,
        element: <OrderHistory />,
      },
      {
        path: ROUTER_URL.CUSTOMER.REVIEW_HISTORY,
        element: <ReviewHistory />,
      },
    ],
  },
];
