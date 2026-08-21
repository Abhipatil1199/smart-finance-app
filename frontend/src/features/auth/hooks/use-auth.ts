import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/features/auth/hooks/auth-context";

/**
 * The only supported way to read or change auth state.
 *
 * Components never touch token storage directly, so swapping the storage
 * strategy stays invisible to them.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}
