import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SellerRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!["seller", "admin"].includes(user?.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;