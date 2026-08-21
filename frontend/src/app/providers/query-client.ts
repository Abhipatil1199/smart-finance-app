import { QueryClient } from "@tanstack/react-query";

import { ApiErrorCode, type ApiError } from "@/services/api/api-error";

/** Retrying these only wastes time — the outcome will not change. */
const NON_RETRYABLE: ApiErrorCode[] = [
  ApiErrorCode.Unauthorized,
  ApiErrorCode.Forbidden,
  ApiErrorCode.NotFound,
  ApiErrorCode.Conflict,
  ApiErrorCode.Validation,
];

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const code = (error as ApiError)?.code;
          if (code && NON_RETRYABLE.includes(code)) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        // Mutations are not assumed idempotent; each hook opts in explicitly.
        retry: false,
      },
    },
  });
}
