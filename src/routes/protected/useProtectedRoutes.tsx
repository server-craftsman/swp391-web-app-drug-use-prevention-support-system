import { Suspense, type JSX } from "react";
import { Navigate } from "react-router-dom";
import type { RouteObject } from 'react-router-dom';
import { UserRole } from "../../app/enums";
import { AdminRoutes } from "../protected/access/adminPermission";
import Loading from "../../app/screens/Loading";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useAuth } from "../../contexts/Auth.context";
import GuardProtectedRoute from "./GuardProtectedRoute";

const useProtectedRoutes = (): RouteObject[] => {
  const { role, isLoading } = useAuth();

  let roleBasedRoutes: RouteObject[] = [];

  // Handle loading state
  if (isLoading) {
    return [
      {
        path: "*",
        element: <Suspense fallback={<Loading />}><Loading /></Suspense>
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

  const wrapRoute = (route: RouteObject, allowedRoles: UserRole[]): RouteObject => {
    const wrappedRoute: RouteObject = {
      ...route,
      element: (
        <Suspense fallback={<Loading />}>
          <GuardProtectedRoute 
            component={route.element as JSX.Element} 
            allowedRoles={allowedRoles}
          />
        </Suspense>
      )
    };

    if (route.children) {
      wrappedRoute.children = route.children.map(child => 
        wrapRoute(child, allowedRoles)
      );
    }

    return wrappedRoute;
  };

  switch (role) {
    case UserRole.ADMIN:
      // Ensure AdminRoutes is an array
      if (Array.isArray(AdminRoutes)) {
        roleBasedRoutes = AdminRoutes.map(route => wrapRoute(route, [UserRole.ADMIN]));
      } else {
        // If AdminRoutes is an object with route collections
        roleBasedRoutes = Object.values(AdminRoutes)
          .flat()
          .map(route => wrapRoute(route, [UserRole.ADMIN]));
      }
      break;
    // Add other role cases as needed
    default:
      roleBasedRoutes = [
        {
          path: "*",
          element: <Navigate to={ROUTER_URL.AUTH.UNAUTHOZIZED} replace />
        }
      ];
  }

  return roleBasedRoutes;
};

export default useProtectedRoutes;