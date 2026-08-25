import { createContext } from "react";

import type { AuthStatus, AuthUser } from "@/features/auth/types/auth.types";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  /** True while the app is attempting to rehydrate a session on boot. */
  isLoading: boolean;
  /** Persists an access token and user returned by login or refresh. */
  startSession: (accessToken: string, user: AuthUser) => void;
  /** Clears the token, the cached user and any server state held for them. */
  endSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
