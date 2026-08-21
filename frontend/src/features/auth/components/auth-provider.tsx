import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { tokenStorage } from "@/services/auth/token-storage";
import { AuthContext, type AuthContextValue } from "@/features/auth/hooks/auth-context";
import type { AuthSession, AuthUser } from "@/features/auth/types/auth.types";

/**
 * Holds the signed-in user for the app.
 *
 * The access token is intentionally *not* React state: it goes straight to
 * `tokenStorage`. Keeping it out of the component tree means it never lands in
 * a React DevTools snapshot, a state-persistence layer, or an error report
 * that serialises props.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);

  const startSession = useCallback((session: AuthSession) => {
    const accessToken = session.tokens?.accessToken;
    if (accessToken) {
      tokenStorage.setAccessToken(accessToken);
    }
    setUser(session.user);
  }, []);

  const endSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    // Drops any cached responses fetched for the previous user.
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status: user ? "authenticated" : "anonymous",
      isAuthenticated: user !== null,
      startSession,
      endSession,
    }),
    [user, startSession, endSession]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
