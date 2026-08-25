import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { env } from "@/lib/env";
import { tokenStorage } from "@/services/auth/token-storage";
import { toApiError } from "@/services/api/api-error";

/** Inlined here (not imported from auth.api) to avoid a circular dependency. */
const REFRESH_ENDPOINT = "/api/auth/refresh";

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    "Content-Type": "application/json",
  },
  // The refresh-token cookie is httpOnly, so the browser must send it
  // automatically on every request to the auth path.
  withCredentials: true,
});

/* ------------------------------------------------------------------ *
 * Request interceptor — attach the access token
 * ------------------------------------------------------------------ */
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/* ------------------------------------------------------------------ *
 * Response interceptor — silent 401 refresh with request queuing
 *
 * When a request fails with 401:
 *   1. If no refresh is in progress, call /api/auth/refresh to get a
 *      fresh access token.
 *   2. Queue any other 401s that arrive while the refresh is in-flight.
 *   3. On success, replay every queued request with the new token.
 *   4. On failure, reject them all and clear the session.
 * ------------------------------------------------------------------ */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  for (const { resolve, reject } of failedQueue) {
    if (token) {
      resolve(token);
    } else {
      reject(error);
    }
  }
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't retry if:
    // - Not a 401
    // - Already retried this request
    // - The failing request IS the refresh endpoint (avoid infinite loop)
    const isRefreshRequest = originalRequest?.url === REFRESH_ENDPOINT;

    if (error.response?.status !== 401 || originalRequest?._retry || isRefreshRequest) {
      // For non-retryable 401s (e.g. refresh itself failed), clear session
      if (error.response?.status === 401 && isRefreshRequest) {
        tokenStorage.clear();
      }
      return Promise.reject(toApiError(error));
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
        return api(originalRequest);
      }).catch((err) => {
        return Promise.reject(toApiError(err));
      });
    }

    // Start a refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ accessToken: string }>(
        `${env.apiUrl}${REFRESH_ENDPOINT}`,
        {},
        { withCredentials: true }
      );

      const newToken = data.accessToken;
      tokenStorage.setAccessToken(newToken);
      processQueue(null, newToken);

      // Replay the original request with the fresh token
      originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      return Promise.reject(toApiError(refreshError));
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
export { api };
