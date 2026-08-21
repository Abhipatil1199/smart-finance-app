import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

import { env } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/common/brand-mark";
import { ROUTES } from "@/app/router/paths";

export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="grid min-h-screen-safe place-items-center bg-background px-6 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <BrandMark />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {isNotFound ? "Page not found" : "Something went wrong"}
          </h1>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
            {isNotFound
              ? "That page doesn't exist, or it moved. Let's get you back on track."
              : "We hit an unexpected error. Trying again usually clears it."}
          </p>
        </div>

        {/* Error internals stay in development; in production they can leak
            paths, tokens or query shapes into a screenshot. */}
        {env.isDev && error instanceof Error ? (
          <pre className="w-full overflow-x-auto rounded-lg bg-muted p-3 text-left text-xs text-muted-foreground">
            {error.message}
          </pre>
        ) : null}

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" size="xl" onClick={() => navigate(ROUTES.signin, { replace: true })}>
            Back to sign in
          </Button>
          <Button type="button" size="xl" variant="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}
