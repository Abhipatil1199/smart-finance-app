/** The authenticated user as the client is allowed to see it. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

/**
 * Present only while the API returns tokens in the response body. Under the
 * httpOnly-cookie strategy the server omits this and sets a cookie instead,
 * which is why every field is optional.
 */
export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthSession {
  user: AuthUser;
  tokens?: AuthTokens;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
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

export type AuthStatus = "anonymous" | "authenticated";
