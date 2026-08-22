import api from "@/services/api/axios";
import { normalizeEmail, normalizePhone, normalizeText } from "@/lib/sanitize";
import type {
  AuthSession,
  SigninRequest,
  SignupRequest,
} from "@/features/auth/types/auth.types";

/**
 * Placeholder endpoints. Point these at the real paths when the backend is
 * ready — no component imports them directly, so nothing else has to change.
 */
export const AUTH_ENDPOINTS = {
  signup: "/api/auth/register",
  signin: "/api/auth/login",
  signout: "/api/auth/signout",
  currentUser: "/api/auth/me",
} as const;

export async function signup(payload: SignupRequest): Promise<AuthSession> {
  const { data } = await api.post<AuthSession>(AUTH_ENDPOINTS.signup, {
    firstName: normalizeText(payload.firstName),
    lastName: normalizeText(payload.lastName),
    email: normalizeEmail(payload.email),
    phone: normalizePhone(payload.phone),
    // Never normalised or trimmed: every character the user typed is
    // significant, and altering it would silently change the credential.
    password: payload.password,
  });
  return data;
}

export async function signin(payload: SigninRequest): Promise<AuthSession> {
  const { data } = await api.post<AuthSession>(AUTH_ENDPOINTS.signin, {
    email: normalizeEmail(payload.email),
    password: payload.password,
    // rememberMe: payload.rememberMe ?? false,
  });
  return data;
}

export async function signout(): Promise<void> {
  await api.post(AUTH_ENDPOINTS.signout);
}

/**
 * Rehydrates a session from an httpOnly cookie, where the client cannot read
 * the token itself. Unused until that strategy is switched on.
 */
export async function fetchCurrentUser(): Promise<AuthSession> {
  const { data } = await api.get<AuthSession>(AUTH_ENDPOINTS.currentUser);
  return data;
}
