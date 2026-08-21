/**
 * Public surface of the auth feature. Other features should import from here
 * rather than reaching into subfolders, so internals stay free to move.
 */
export { AuthProvider } from "@/features/auth/components/auth-provider";
export { RequireAuth } from "@/features/auth/components/require-auth";
export { useAuth } from "@/features/auth/hooks/use-auth";
export { useSigninMutation } from "@/features/auth/hooks/use-signin-mutation";
export { useSignupMutation } from "@/features/auth/hooks/use-signup-mutation";
export { useSignoutMutation } from "@/features/auth/hooks/use-signout-mutation";
export { authKeys } from "@/features/auth/api/auth.keys";
export type { AuthSession, AuthStatus, AuthUser } from "@/features/auth/types/auth.types";
