import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { signin } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ApiError } from "@/services/api/api-error";
import type { LoginResponse, SigninRequest } from "@/features/auth/types/auth.types";

export function useSigninMutation(): UseMutationResult<LoginResponse, ApiError, SigninRequest> {
  const { startSession } = useAuth();

  return useMutation<LoginResponse, ApiError, SigninRequest>({
    mutationFn: signin,
    onSuccess: (data) => {
      startSession(data.accessToken, data.user);
    },
    // Retrying a rejected credential burns attempts against server-side
    // lockout counters without the user ever seeing the extra tries.
    retry: false,
  });
}
