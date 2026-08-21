/**
 * Every route path in one place, so links stay correct when paths move.
 * Sign-in is the index route: an unauthenticated visitor lands there.
 */
export const ROUTES = {
  signin: "/",
  signup: "/signup",
  dashboard: "/dashboard",
  forgotPassword: "/forgot-password",
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
