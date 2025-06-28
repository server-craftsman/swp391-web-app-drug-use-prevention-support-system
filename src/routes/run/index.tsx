import { Route, Routes } from "react-router-dom";
// import { lazy } from "react";

//import context
import { useAuth } from "../../contexts/Auth.context";

// Import router path
import { ROUTER_URL } from "../../consts/router.path.const";
// import { UserRole } from "../../app/enums";

// Import guard routes
import GuardPublicRoute from "../unprotected/GuardGuestRoute";

// Import route configurations
import { publicSubPaths } from "../unprotected/GuestSubPaths";
import useProtectedRoutes from "../protected/useProtectedRoutes";

// // Import loading component
// const Loading = lazy(() => import("../../app/screens/Loading"));

const RunRoutes = () => {
  const { role } = useAuth();

  // Get protected routes based on user role
  const protectedRoutes = useProtectedRoutes();

  // const getDefaultPath = (role: string) => {
  //   switch (role) {
  //     case UserRole.ADMIN:
  //       return ROUTER_URL.ADMIN.BASE;
  //     case UserRole.MANAGER:
  //       return ROUTER_URL.MANAGER.BASE;
  //     case UserRole.STAFF:
  //       return ROUTER_URL.STAFF.BASE;
  //     case UserRole.CONSULTANT:
  //       return ROUTER_URL.CONSULTANT.BASE;
  //     case UserRole.CUSTOMER:
  //       return ROUTER_URL.COMMON.HOME;
  //     default:
  //       return ROUTER_URL.COMMON.HOME;
  //   }
  // };

  // // Show loading while authentication is being determined
  // if (isLoading) {
  //   return (
  //     <Routes>
  //       <Route path="*" element={<div>Loading...</div>} />
  //     </Routes>
  //   );
  // }

  return (
    <Routes>
      {/* Public Routes - Always available */}
      {Object.entries(publicSubPaths).map(([key, routes]) =>
        routes.map((route, index) => {
          const routeKey = `${key}-${index}`;

          if (route.children) {
            // Routes with children (like MainLayout)
            return (
              <Route
                key={routeKey}
                path={route.path}
                element={<GuardPublicRoute component={route.element} />}
              >
                {route.children.map((childRoute, childIndex) => (
                  <Route
                    key={`${routeKey}-child-${childIndex}`}
                    path={childRoute.path}
                    element={childRoute.element}
                    index={childRoute.path === ROUTER_URL.COMMON.HOME}
                  />
                ))}
              </Route>
            );
          } else {
            // Standalone routes (like auth pages)
            return (
              <Route
                key={routeKey}
                path={route.path}
                element={<GuardPublicRoute component={route.element} />}
              />
            );
          }
        })
      )}

      {/* Protected Routes - Based on user role and authentication */}
      {protectedRoutes.map((route, index) => {
        const routeKey = `protected-${index}`;

        if (route.children) {
          // Routes with children (like AdminLayout)
          return (
            <Route
              key={routeKey}
              path={route.path}
              element={route.element}
            >
              {route.children.map((childRoute, childIndex) => (
                <Route
                  key={`${routeKey}-child-${childIndex}`}
                  path={childRoute.path}
                  element={childRoute.element}
                  index={childRoute.index}
                />
              ))}
            </Route>
          );
        } else {
          // Standalone protected routes
          return (
            <Route
              key={routeKey}
              path={route.path}
              element={route.element}
              index={route.index}
            />
          );
        }
      })}

      {/* Fallback route */}
      <Route
        path="*"
        element={
          role ?
            <Routes>
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes> :
            <GuardPublicRoute component={<div>Page Not Found</div>} />
        }
      />
    </Routes>
  );
};

export default RunRoutes;