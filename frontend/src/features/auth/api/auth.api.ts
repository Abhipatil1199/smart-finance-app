import api from "@/services/api/axios";
import { normalizeEmail, normalizeText } from "@/lib/sanitize";
import type {
  LoginResponse,
  RefreshResponse,
  SigninRequest,
  SignupRequest,
  SignupResponse,
  GetMeResponse,
} from "@/features/auth/types/auth.types";

/**
 * Endpoints matching the real backend routes.
 */
export const AUTH_ENDPOINTS = {
  signup: "/api/auth/register",
  signin: "/api/auth/login",
  refresh: "/api/auth/refresh",
  signout: "/api/auth/logout",
  logoutAll: "/api/auth/logout-all",
  currentUser: "/api/users/me",
} as const;

export async function signup(payload: SignupRequest): Promise<SignupResponse> {
  const { data } = await api.post<SignupResponse>(AUTH_ENDPOINTS.signup, {
    firstName: normalizeText(payload.firstName),
    lastName: normalizeText(payload.lastName),
    email: normalizeEmail(payload.email),
    // Never normalised or trimmed: every character the user typed is
    // significant, and altering it would silently change the credential.
    password: payload.password,
  });
  return data;
}

export async function signin(payload: SigninRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(AUTH_ENDPOINTS.signin, {
    email: normalizeEmail(payload.email),
    password: payload.password,
  });
  return data;
}

/**
 * Calls the refresh endpoint. The httpOnly `refreshToken` cookie is sent
 * automatically by the browser. Returns a fresh access token and rotates
 * the cookie.
 */
export async function refreshToken(): Promise<RefreshResponse> {
  const { data } = await api.post<RefreshResponse>(AUTH_ENDPOINTS.refresh);
  return data;
}

export async function signout(): Promise<void> {
  await api.post(AUTH_ENDPOINTS.signout);
}

/**
 * Revokes all refresh tokens for the current user. Requires a valid
 * access token in the Authorization header (handled by the axios interceptor).
 */
export async function logoutAll(): Promise<void> {
  await api.post(AUTH_ENDPOINTS.logoutAll);
}

/**
 * Fetches the current user's profile. Used after session rehydration
 * to restore the user object.
 */
export async function fetchCurrentUser(): Promise<GetMeResponse> {
  const { data } = await api.get<GetMeResponse>(AUTH_ENDPOINTS.currentUser);
  return data;
}
