import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

//import context
import { useAuth } from "../../contexts/Auth.context";

// Import router path
import { ROUTER_URL } from "../../consts/router.path.const";
import { UserRole } from "../../app/enums";

// Import guard routes
import GuardProtectedRoute from "../protected/GuardProtectedRoute";
import GuardPublicRoute from "../unprotected/GuardGuestRoute";

// Import layout
const AdminLayout = lazy(() => import("../../layouts/admin/Admin.layout"));

// Import sub paths
import { publicSubPaths } from "../unprotected/GuestSubPaths";
import { AdminRoutes } from "../protected/access/adminPermission";

const RunRoutes = () => {
  const { role, isLoading } = useAuth();

  const getDefaultPath = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return ROUTER_URL.ADMIN.BASE;
      case UserRole.CUSTOMER:
        return ROUTER_URL.COMMON.HOME;
      case UserRole.MANAGER:
        return ROUTER_URL.COMMON.HOME;
      case UserRole.STAFF:
        return ROUTER_URL.COMMON.HOME;
      case UserRole.CONSULTANT:
        return ROUTER_URL.COMMON.HOME;
      default:
        return ROUTER_URL.COMMON.HOME;
    }
  };

  const renderProtectedRoutes = () => {
    if (isLoading) {
      return null; // Don't render protected routes while authentication is loading
    }

    if (!role) {
      return null; // Don't render protected routes if not authenticated
    }

    const handleAccessDenied = () => {
      const defaultPath = getDefaultPath(role);
      window.location.replace(defaultPath);
    };

    return (
      <>
        <Route path={ROUTER_URL.ADMIN.BASE} element={
          <GuardProtectedRoute 
            component={<AdminLayout />} 
            allowedRoles={[UserRole.ADMIN]} 
            onAccessDenied={handleAccessDenied} 
          />
        }>
          {AdminRoutes[ROUTER_URL.ADMIN.BASE]?.map((route) => (
            <Route
              key={route.path || "index"}
              index={route.index}
              path={route.path?.replace("/admin/", "")}
              element={route.element}
            />
          ))}
        </Route>
        
        {/* Other role-based routes can be added here */}
      </>
    );
  };

  // Create a mapping of each route type
  // const renderPublicRoutes = () => {
  //   // Get all main layout routes
  //   const mainLayoutRoutes = publicSubPaths[ROUTER_URL.COMMON.HOME] || [];
    
  //   // Extract all auth routes directly from publicSubPaths
  //   const authPaths = Object.keys(publicSubPaths).filter(path => 
  //     path.startsWith('/') && path !== ROUTER_URL.COMMON.HOME && path !== ROUTER_URL.ADMIN.BASE
  //   );
    
  //   return (
  //     <>
  //       {/* Main Layout with Home and Content Pages */}
  //       {mainLayoutRoutes.map(route => (
  //         <Route
  //           key="main-layout"
  //           element={<GuardPublicRoute component={route.element} />}
  //         >
  //           {route.children?.map(childRoute => (
  //             <Route
  //               key={childRoute.path}
  //               path={childRoute.path}
  //               element={childRoute.element}
  //               index={childRoute.path === ROUTER_URL.COMMON.HOME}
  //             />
  //           ))}
  //         </Route>
  //       ))}

  //       {/* Auth Pages - Dynamically render all routes from publicSubPaths */}
  //       {authPaths.flatMap(path => 
  //         publicSubPaths[path].map(route => (
  //           <Route
  //             key={route.path}
  //             path={route.path}
  //             element={<GuardPublicRoute component={route.element} />}
  //           />
  //         ))
  //       )}
  //     </>
  //   );
  // };

  // Render all routes
  return (
    <Routes>
      {/* Public Routes */}
      {/* {renderPublicRoutes()} */}
      {Object.entries(publicSubPaths).map(([key, routes]) =>
        routes.map((route) => (
          <Route key={route.path || "index"} path={route.path} element={key === ROUTER_URL.COMMON.HOME ? <GuardPublicRoute component={route.element} /> : route.element}>
            {route.children?.map((childRoute) => <Route key={childRoute.path} path={childRoute.path} element={childRoute.element} />)}
          </Route>
        ))
      )}

      {/* Protected Routes */}
      {renderProtectedRoutes()}
    </Routes>
  );
};

export default RunRoutes;