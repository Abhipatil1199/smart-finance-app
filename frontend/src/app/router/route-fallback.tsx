import { Spinner } from "@/components/ui/spinner";

/** Shown while a lazily-loaded route chunk is in flight. */
export function RouteFallback() {
  return (
    <div className="grid min-h-screen-safe place-items-center bg-background">
      <div role="status" className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        Loading Smart Finance…
      </div>
    </div>
  );
}
