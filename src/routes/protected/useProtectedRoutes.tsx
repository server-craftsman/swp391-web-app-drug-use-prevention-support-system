import { Suspense, type JSX } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from 'react-router-dom';
import { UserRole } from "../../app/enums";
import { AdminRoutes } from "./access/adminPermission";
import { CustomerRoutes } from "./access/customerPermission";
import { ConsultantRoutes } from "./access/consultantPermission";
import { StaffRoutes } from "./access/staffPermission";
import { ManagerRoutes } from "./access/managerPermission";
// import Loading from "../../app/screens/Loading";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useAuth } from "../../contexts/Auth.context";
import GuardProtectedRoute from "./GuardProtectedRoute";

const useProtectedRoutes = (): RouteObject[] => {
  const { role, isLoading } = useAuth();

  // Handle loading state
  if (isLoading) {
    return [
      {
        path: "*",
        element: <Suspense></Suspense>
      }
    ];
  }

  // Handle unauthenticated state
  if (role === null) {
    return [
      {
        path: "*",
        element: <Navigate to={ROUTER_URL.AUTH.LOGIN} replace />
      }
    ];
  }

  // Get routes based on user role
  let protectedRoutes: RouteObject[] = [];

  switch (role) {
    case UserRole.ADMIN:
      // Admin has access to admin routes and can access customer routes too
      protectedRoutes = [
        ...AdminRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.ADMIN]}
              />
            </Suspense>
          )
        })),
        ...CustomerRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.ADMIN]}
              />
            </Suspense>
          )
        }))
      ];
      break;

    case UserRole.MANAGER:
      // Manager has access to manager routes and customer routes
      protectedRoutes = [
        ...ManagerRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.MANAGER]}
              />
            </Suspense>
          )
        })),
        ...CustomerRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.MANAGER]}
              />
            </Suspense>
          )
        }))
      ];
      break;

    case UserRole.STAFF:
      // Staff has access to staff routes and customer routes
      protectedRoutes = [
        ...StaffRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.STAFF]}
              />
            </Suspense>
          )
        })),
        ...CustomerRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.STAFF]}
              />
            </Suspense>
          )
        }))
      ];
      break;

    case UserRole.CONSULTANT:
      // Consultant has access to consultant routes and customer routes
      protectedRoutes = [
        ...ConsultantRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.CONSULTANT]}
              />
            </Suspense>
          )
        })),
        ...CustomerRoutes.map(route => ({
          ...route,
          element: (
            <Suspense>
              <GuardProtectedRoute
                component={route.element as JSX.Element}
                allowedRoles={[UserRole.CONSULTANT]}
              />
            </Suspense>
          )
        }))
      ];
      break;

    case UserRole.CUSTOMER:
      // Customer has access to customer routes only
      protectedRoutes = CustomerRoutes.map(route => ({
        ...route,
        element: (
          <Suspense>
            <GuardProtectedRoute
              component={route.element as JSX.Element}
              allowedRoles={[UserRole.CUSTOMER]}
            />
          </Suspense>
        )
      }));
      break;

    default:
      // Unknown role, redirect to login
      return [
        {
          path: "*",
          element: <Navigate to={ROUTER_URL.AUTH.LOGIN} replace />
        }
      ];
  }

  return protectedRoutes;
};

export default useProtectedRoutes;