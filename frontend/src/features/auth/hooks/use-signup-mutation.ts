import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { signup } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ApiError } from "@/services/api/api-error";
import type { AuthSession, SignupRequest } from "@/features/auth/types/auth.types";

export function useSignupMutation(): UseMutationResult<AuthSession, ApiError, SignupRequest> {
  const { startSession } = useAuth();

  return useMutation<AuthSession, ApiError, SignupRequest>({
    mutationFn: signup,
    onSuccess: startSession,
    // Creating an account is not idempotent; a retried request could produce
    // a duplicate or a misleading "already exists" on a call that succeeded.
    retry: false,
  });
}
