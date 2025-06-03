import { lazy } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";
import About from "../../pages/about";
import Course from "../../pages/course";
import Blog from "../../pages/blog";
import Counsel from "../../pages/counsel";
//================= PUBLIC SUB PATHS =================
const MainLayout = lazy(() => import("../../layouts/main_layout/main.layout"));
const HomePage = lazy(() => import("../../pages/home"));
const LoginPage = lazy(() => import("../../pages/login"));
const RegisterPage = lazy(() => import("../../pages/register"));
const ForgotPasswordPage = lazy(() => import("../../pages/forgot_password"));
//======================================================
//export public sub paths
export const publicSubPaths: Record<string, RouteObject[]> = {
  [ROUTER_URL.COMMON.HOME]: [
    {
      element: <MainLayout />,
      children: [
        {
          path: ROUTER_URL.COMMON.HOME,
          element: <HomePage />,
        },
        {
          path: ROUTER_URL.COMMON.ABOUT,
          element: <About />,
        },
        {
          path: ROUTER_URL.CLIENT.COURSE,
          element: <Course />,
        },
        {
          path: ROUTER_URL.CLIENT.BLOG,
          element: <Blog />,
        },
        {
          path: ROUTER_URL.CLIENT.COUNSEL,
          element: <Counsel />,
        },
      ],
    },
  ],
  [ROUTER_URL.AUTH.LOGIN]: [
    {
      element: <LoginPage />,
      path: ROUTER_URL.AUTH.LOGIN,
    },
  ],
  [ROUTER_URL.AUTH.SIGN_UP]: [
    {
      element: <RegisterPage />,
      path: ROUTER_URL.AUTH.SIGN_UP,
    },
  ],
  [ROUTER_URL.AUTH.FORGOT_PASSWORD]: [
    {
      element: <ForgotPasswordPage />,
      path: ROUTER_URL.AUTH.FORGOT_PASSWORD,
    },
  ],
};
