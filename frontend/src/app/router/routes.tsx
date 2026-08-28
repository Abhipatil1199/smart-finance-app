import { Navigate, type RouteObject } from "react-router-dom";

import { ROUTES } from "@/app/router/paths";
import { RouteError } from "@/app/router/route-error";
import { RouteFallback } from "@/app/router/route-fallback";
import { RequireAuth } from "@/features/auth/components/require-auth";

import { AppLayout } from "@/layouts/app-layout";

/**
 * Route table, kept separate from router creation so it can be matched and
 * inspected without a DOM (and reused with a memory router in tests).
 *
 * Route-level code splitting: each page is its own chunk, so the first load
 * only pays for sign-in. `lazy` also lets the router keep the current screen
 * on screen while the next chunk downloads, instead of flashing a fallback.
 */
export const routes: RouteObject[] = [
  {
    // No element: react-router renders an <Outlet /> for a layout route.
    path: ROUTES.signin,
    errorElement: <RouteError />,
    hydrateFallbackElement: <RouteFallback />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("@/features/auth/pages/signin-page"))
            .SigninPage,
        }),
      },
      {
        path: "signup",
        lazy: async () => ({
          Component: (await import("@/features/auth/pages/signup-page"))
            .SignupPage,
        }),
      },
      // `/signin` is a natural thing to type or bookmark; keep it working
      // rather than 404, but let `/` stay the canonical URL.
      { path: "signin", element: <Navigate to={ROUTES.signin} replace /> },
      {
        Component: RequireAuth,
        children: [
          {
            Component: AppLayout,
            children: [
              {
                path: "dashboard",
                lazy: async () => ({
                  Component: (await import("@/features/income/pages/income-page"))
                    .IncomePage,
                }),
              },
              {
                path: "income",
                lazy: async () => ({
                  Component: (await import("@/features/income/pages/income-page"))
                    .IncomePage,
                }),
              },
            ],
          },
        ],
      },
      { path: "*", element: <Navigate to={ROUTES.signin} replace /> },
    ],
  },
];
