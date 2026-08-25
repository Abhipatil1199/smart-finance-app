/** The authenticated user as the client is allowed to see it. */
export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

/** POST /api/auth/register → { message, user } */
export interface SignupResponse {
  message: string;
  user: AuthUser;
}

/** POST /api/auth/login → { message, accessToken, user } */
export interface LoginResponse {
  message: string;
  accessToken: string;
  user: AuthUser;
}

/** POST /api/auth/refresh → { accessToken } */
export interface RefreshResponse {
  accessToken: string;
}

/** GET /api/users/me → { user } */
export interface GetMeResponse {
  user: AuthUser;
}

export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SigninRequest {
  email: string;
  password: string;
  /**
   * Forwarded to the server, which owns session lifetime. Deciding this
   * client-side would be advisory only — the token's expiry is what counts.
   */
  rememberMe?: boolean;
}

export type AuthStatus = "anonymous" | "authenticated" | "loading";
