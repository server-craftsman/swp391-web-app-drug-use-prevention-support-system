import React from "react";
import { useAuth } from "../../contexts/Auth.context";
import Loading from "../../app/screens/Loading";

interface GuardGuestRouteProps {
  component: React.ReactNode;
}

/**
 * This component renders its children for both authenticated and non-authenticated users
 * It only shows a loading state while authentication status is being determined
 */
const GuardGuestRoute = ({ component }: GuardGuestRouteProps) => {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading />;
  }
  
  return <>{component}</>;
};

export default GuardGuestRoute;