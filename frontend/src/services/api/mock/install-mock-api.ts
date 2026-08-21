import { AxiosError, AxiosHeaders, type AxiosAdapter, type AxiosInstance, type AxiosResponse } from "axios";
import axios from "axios";

import { authMockHandlers } from "@/services/api/mock/auth-mock-handlers";

export type MockRequest = {
  method: string;
  path: string;
  body: Record<string, unknown>;
};

export type MockResult = {
  status: number;
  data: unknown;
};

/** Returns `null` when the handler does not claim the request. */
export type MockHandler = (request: MockRequest) => Promise<MockResult | null> | MockResult | null;

function toPath(url: string, baseURL?: string): string {
  let path = url;
  if (baseURL && path.startsWith(baseURL)) {
    path = path.slice(baseURL.length);
  }
  path = path.split("?")[0].split("#")[0];
  return path.startsWith("/") ? path : `/${path}`;
}

function parseBody(data: unknown): Record<string, unknown> {
  if (typeof data === "string" && data.length > 0) {
    try {
      const parsed: unknown = JSON.parse(data);
      return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  if (typeof data === "object" && data !== null) {
    return data as Record<string, unknown>;
  }
  return {};
}

/**
 * Replaces the instance adapter with one that answers a fixed set of routes
 * in-browser and forwards everything else to the real network adapter.
 *
 * Keeping this at the adapter level means the interceptors, error
 * normalisation and react-query code all run exactly as they will in
 * production — only the transport is faked. Removing the mock is a one-line
 * change in `axios.ts`.
 */
export function installMockApi(instance: AxiosInstance, handlers: MockHandler[] = authMockHandlers): void {
  const networkAdapter = axios.getAdapter(instance.defaults.adapter ?? axios.defaults.adapter);

  const mockAdapter: AxiosAdapter = async (config) => {
    const request: MockRequest = {
      method: (config.method ?? "get").toUpperCase(),
      path: toPath(config.url ?? "", config.baseURL),
      body: parseBody(config.data),
    };

    let result: MockResult | null = null;
    for (const handler of handlers) {
      result = await handler(request);
      if (result) break;
    }

    if (!result) {
      return networkAdapter(config);
    }

    const response: AxiosResponse = {
      data: result.data,
      status: result.status,
      statusText: String(result.status),
      headers: new AxiosHeaders({ "content-type": "application/json" }),
      config,
      request: { __mock: true },
    };

    // Mirrors axios's own `settle`: 2xx resolves, everything else rejects with
    // an AxiosError carrying the response, so interceptors behave normally.
    const isValid = config.validateStatus ?? ((status: number) => status >= 200 && status < 300);
    if (isValid(response.status)) {
      return response;
    }

    throw new AxiosError(
      `Request failed with status code ${response.status}`,
      response.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      response.request,
      response
    );
  };

  instance.defaults.adapter = mockAdapter;
}
