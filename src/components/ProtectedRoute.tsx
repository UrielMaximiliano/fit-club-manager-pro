
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  requiredRole?: "admin" | "staff" | undefined;
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (requiredRole && currentUser.role !== requiredRole && requiredRole === "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
