import { lazy } from "react";
import { ROUTER_URL } from "../../consts/router.path.const";
import type { RouteObject } from "react-router-dom";

// Client pages that should be public =====
import About from "../../pages/client/about";
import Course from "../../pages/client/course";
import Blog from "../../pages/client/blog";
import Counsel from "../../pages/client/counsel";
import Program from "../../pages/client/program";
import Assessment from "../../pages/client/assessment";
import CourseDetail from "../../components/client/course/CourseDetail.com";
import LessonDetailPage from "../../pages/customer/lesson";
import ProgramDetail from "../../pages/client/program/detail";
import ClientSurveyDetail from "../../pages/client/survey/detail";
import PaymentPageMain from "../../pages/customer/payment";
import PaymentSuccess from "../../pages/customer/success";
import PaymentFail from "../../pages/customer/cancel";
import NotFoundPage from "../../pages/auth/not_found";
import BlogDetail from "../../components/client/blog/detail/BlogDetail.com";

//================= PUBLIC SUB PATHS =================
const UnauthorizedPage = lazy(() => import("../../pages/auth/unauthorized"));
const MainLayout = lazy(() => import("../../layouts/main/Main.layout"));
const HomePage = lazy(() => import("../../pages/client/home"));
const LoginPage = lazy(() => import("../../pages/auth/login"));
const RegisterPage = lazy(() => import("../../pages/auth/register"));
const ForgotPasswordPage = lazy(
  () => import("../../pages/auth/forgot_password")
);
const CartPage = lazy(() => import("../../pages/client/cart"));
const ResetPasswordPage = lazy(() => import("../../pages/auth/reset_password"));
const ConfirmEmailPage = lazy(() => import("../../pages/auth/confirm_email"));
const AppointmentPage = lazy(() => import("../../pages/client/appointment"));
const AssessmentResult = lazy(
  () => import("../../pages/client/assessment/result")
);
//======================================================

// Export public sub paths - Only truly public routes here
export const publicSubPaths: Record<string, RouteObject[]> = {
  // Main public routes with layout
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
          path: ROUTER_URL.CLIENT.CART,
          element: <CartPage />,
        },
        {
          path: ROUTER_URL.CLIENT.COURSE,
          element: <Course />,
        },
        {
          path: ROUTER_URL.CLIENT.COURSE_DETAIL,
          element: <CourseDetail />,
        },
        {
          path: ROUTER_URL.CLIENT.BLOG,
          element: <Blog />,
        },
        {
          path: ROUTER_URL.CLIENT.COUNSEL,
          element: <Counsel />,
        },
        {
          path: ROUTER_URL.CLIENT.PROGRAM,
          element: <Program />,
        },
        {
          path: ROUTER_URL.CLIENT.PROGRAM_DETAIL,
          element: <ProgramDetail />,
        },
        // {
        //   path: ROUTER_URL.CLIENT.SURVEY_DETAIL,
        //   element: <ClientSurvey />,
        // },
        {
          path: ROUTER_URL.CLIENT.ASSESSMENT,
          element: <Assessment />,
        },
        {
          path: ROUTER_URL.CLIENT.ASSESSMENT_RESULT,
          element: <AssessmentResult />,
        },
        {
          path: ROUTER_URL.CLIENT.APPOINTMENTS,
          element: <AppointmentPage />,
        },
        {
          path: ROUTER_URL.CLIENT.PAYMENT,
          element: <PaymentPageMain />,
        },
        {
          path: ROUTER_URL.CLIENT.PAYMENT_SUCCESS,
          element: <PaymentSuccess />,
        },
        {
          path: ROUTER_URL.CLIENT.PAYMENT_FAIL,
          element: <PaymentFail />,
        },
        {
          path: ROUTER_URL.CUSTOMER.LESSON_DETAIL,
          element: <LessonDetailPage />,
        },
        {
          path: ROUTER_URL.CLIENT.BLOG_DETAIL,
          element: <BlogDetail />,
        },
      ],
    },
  ],
  [ROUTER_URL.CLIENT.SURVEY_DETAIL]: [
    {
      path: ROUTER_URL.CLIENT.SURVEY_ATTEMPT,
      element: <ClientSurveyDetail />,
    },
  ],

  // Authentication routes (no layout needed)
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
  [ROUTER_URL.AUTH.RESET_PASSWORD]: [
    {
      element: <ResetPasswordPage />,
      path: ROUTER_URL.AUTH.RESET_PASSWORD,
    },
  ],
  [ROUTER_URL.AUTH.CONFIRM_EMAIL]: [
    {
      element: <ConfirmEmailPage />,
      path: ROUTER_URL.AUTH.CONFIRM_EMAIL,
    },
  ],
  [ROUTER_URL.AUTH.UNAUTHOZIZED]: [
    {
      element: <UnauthorizedPage />,
      path: ROUTER_URL.AUTH.UNAUTHOZIZED,
    },
  ],
  [ROUTER_URL.AUTH.NOT_FOUND]: [
    {
      element: <NotFoundPage />,
      path: ROUTER_URL.AUTH.NOT_FOUND,
    },
  ],
};
