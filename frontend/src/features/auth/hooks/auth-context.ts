import { createContext } from "react";

import type { AuthSession, AuthStatus, AuthUser } from "@/features/auth/types/auth.types";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  /** Persists a session returned by signup or signin. */
  startSession: (session: AuthSession) => void;
  /** Clears the token, the cached user and any server state held for them. */
  endSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
