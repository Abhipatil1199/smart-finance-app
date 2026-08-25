import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { logoutAll } from "@/features/auth/api/auth.api";
import { useAuth } from "@/features/auth/hooks/use-auth";
import type { ApiError } from "@/services/api/api-error";

/**
 * Revokes every active refresh token for the current user (all devices),
 * then clears the local session.
 */
export function useLogoutAllMutation(): UseMutationResult<void, ApiError, void> {
  const { endSession } = useAuth();

  return useMutation<void, ApiError, void>({
    mutationFn: logoutAll,
    // The local session is cleared either way. If the server call fails the
    // user must still end up signed out on this device.
    onSettled: endSession,
    retry: false,
  });
}
