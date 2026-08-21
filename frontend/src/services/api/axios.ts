import axios from "axios";

import { env } from "@/lib/env";
import { tokenStorage } from "@/services/auth/token-storage";
import { toApiError } from "@/services/api/api-error";

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    "Content-Type": "application/json",
  },
  // Required for the httpOnly-cookie strategy; a no-op for the others.
  withCredentials: tokenStorage.usesCredentials,
});

/* ------------------------------------------------------------------ *
 * JWT integration point
 *
 * Everything token-related lives in these two interceptors. When the real
 * backend lands, this is the only file that changes:
 *
 *   1. If tokens come back in the response body, the request interceptor
 *      below already attaches them — nothing to do.
 *   2. If they come back as httpOnly cookies, set
 *      VITE_AUTH_TOKEN_STRATEGY=cookie; the header is then skipped and
 *      `withCredentials` carries the session instead.
 *   3. Silent refresh goes in the marked block of the response interceptor.
 * ------------------------------------------------------------------ */

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error);

    // --- Refresh-token retry goes here ---------------------------------
    // On a 401, call the refresh endpoint once, store the new token via
    // `tokenStorage.setAccessToken`, and replay the original request.
    // Until the backend exists, a 401 simply clears the session so the app
    // cannot sit in a half-authenticated state.
    if (apiError.status === 401) {
      tokenStorage.clear();
    }
    // -------------------------------------------------------------------

    return Promise.reject(apiError);
  }
);

export default api;
export { api };
