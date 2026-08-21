/**
 * react-query key factory for the auth feature. Centralised so invalidation
 * stays exhaustive as more auth-adjacent queries are added.
 */
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "current-user"] as const,
} as const;
