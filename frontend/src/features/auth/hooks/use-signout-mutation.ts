import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { signout } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ApiError } from "@/services/api/api-error";

export function useSignoutMutation(): UseMutationResult<void, ApiError, void> {
  const { endSession } = useAuth();

  return useMutation<void, ApiError, void>({
    mutationFn: signout,
    // The local session is cleared either way. If the server call fails the
    // user must still end up signed out on this device; the server-side token
    // expires on its own.
    onSettled: endSession,
    retry: false,
  });
}
