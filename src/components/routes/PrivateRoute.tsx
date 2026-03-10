import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../modules/hook/useAuth";

export function PrivateRoute() {
  const { user, isLoading } = useAuth();

  console.log("User", user)
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
