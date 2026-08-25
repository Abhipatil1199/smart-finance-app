import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/app/router/paths";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

/**
 * Gate for authenticated routes.
 *
 * This is a UX guard, not a security boundary — the API must authorise every
 * request independently. The attempted path is passed along so the sign-in
 * page can return the user there once that redirect is wired up.
 */
export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="grid min-h-screen-safe place-items-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8" />
          <p className="text-sm text-muted-foreground">Restoring your session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.signin} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
