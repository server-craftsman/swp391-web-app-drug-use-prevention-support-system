import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTER_URL } from "../../consts/router.path.const";
import { useAuth } from "../../contexts/Auth.context";

interface GuardProtectedRouteProps {
  component: React.ReactNode;
  allowedRoles: string[];
  onAccessDenied?: () => void;
}

const GuardProtectedRoute = ({ component, allowedRoles, onAccessDenied }: GuardProtectedRouteProps) => {
  const { role, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading state while authentication is being determined
    return <div>Loading...</div>;
  }
  
  if (!role) {
    // If no role, redirect to login
    return <Navigate to={ROUTER_URL.AUTH.LOGIN} replace />;
  }
  
  if (!allowedRoles.includes(role)) {
    // Only deny access if userRole is determined but not allowed
    onAccessDenied?.();
    return <Navigate to={ROUTER_URL.AUTH.UNAUTHOZIZED} replace />;
  }
  
  return <>{component}</>;
};

export default GuardProtectedRoute;