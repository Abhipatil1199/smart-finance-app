import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { tokenStorage } from "@/services/auth/token-storage";
import {
  AuthContext,
  type AuthContextValue,
} from "@/features/auth/hooks/auth-context";
import { refreshToken, fetchCurrentUser } from "@/features/auth/api/auth.api";
import type { AuthUser } from "@/features/auth/types/auth.types";

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
  const [isLoading, setIsLoading] = useState(true);

  const startSession = useCallback(
    (accessToken: string, authUser: AuthUser) => {
      tokenStorage.setAccessToken(accessToken);
      setUser(authUser);
      setIsLoading(false);
    },
    [],
  );

  const endSession = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setIsLoading(false);
    // Drops any cached responses fetched for the previous user.
    queryClient.clear();
  }, [queryClient]);

  // Attempt to rehydrate the session on mount.
  // The httpOnly refresh-token cookie is sent automatically. If it's valid
  // the server returns a fresh access token; we then fetch the user profile.
  useEffect(() => {
    let isMounted = true;

    async function rehydrate() {
      try {
        const { accessToken } = await refreshToken();
        if (!isMounted) return;

        tokenStorage.setAccessToken(accessToken);

        const { user: freshUser } = await fetchCurrentUser();
        if (!isMounted) return;

        setUser(freshUser);
      } catch {
        // No valid refresh token — user stays anonymous.
        tokenStorage.clear();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void rehydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status: isLoading ? "loading" : user ? "authenticated" : "anonymous",
      isAuthenticated: user !== null,
      isLoading,
      startSession,
      endSession,
    }),
    [user, isLoading, startSession, endSession],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
