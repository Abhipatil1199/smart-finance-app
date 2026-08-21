import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { signin } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ApiError } from "@/services/api/api-error";
import type { AuthSession, SigninRequest } from "@/features/auth/types/auth.types";

export function useSigninMutation(): UseMutationResult<AuthSession, ApiError, SigninRequest> {
  const { startSession } = useAuth();

  return useMutation<AuthSession, ApiError, SigninRequest>({
    mutationFn: signin,
    onSuccess: startSession,
    // Retrying a rejected credential burns attempts against server-side
    // lockout counters without the user ever seeing the extra tries.
    retry: false,
  });
}
