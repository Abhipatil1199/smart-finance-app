import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/app/router/paths";
import { useAuth } from "@/features/auth/hooks/use-auth";

/**
 * Gate for authenticated routes.
 *
 * This is a UX guard, not a security boundary — the API must authorise every
 * request independently. The attempted path is passed along so the sign-in
 * page can return the user there once that redirect is wired up.
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.signin} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
