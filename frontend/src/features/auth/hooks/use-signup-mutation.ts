import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { signup } from "@/features/auth/api/auth.api";
import type { ApiError } from "@/services/api/api-error";
import type { SignupResponse, SignupRequest } from "@/features/auth/types/auth.types";

export function useSignupMutation(): UseMutationResult<SignupResponse, ApiError, SignupRequest> {
  return useMutation<SignupResponse, ApiError, SignupRequest>({
    mutationFn: signup,
    // Signup does NOT return tokens, so we don't start a session here.
    // The signup page redirects to sign-in on success.
    // Creating an account is not idempotent; a retried request could produce
    // a duplicate or a misleading "already exists" on a call that succeeded.
    retry: false,
  });
}
