import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function AuthGuard({ children, requiredRole = null }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.publicMetadata.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
