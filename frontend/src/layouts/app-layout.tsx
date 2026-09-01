import { createContext, useCallback, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { LogOutIcon } from "lucide-react";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout-mutation";

/**
 * Context that lets any child page register a callback for the FAB (+) button.
 * The income page registers its "add income" handler here.
 */
interface FabContextValue {
  registerFabHandler: (handler: (() => void) | null) => void;
}

const FabContext = createContext<FabContextValue>({
  registerFabHandler: () => {},
});

/** Hook for pages to register a FAB click handler. */
export function useFabRegistration() {
  return useContext(FabContext);
}

/**
 * Main layout for authenticated pages.
 * Enforces a mobile-only UI by setting a max-w-md width and centering.
 */
export function AppLayout() {
  const signoutMutation = useSignoutMutation();
  const [fabHandler, setFabHandler] = useState<(() => void) | null>(null);

  const registerFabHandler = useCallback(
    (handler: (() => void) | null) => {
      // Wrap in a function to avoid React treating functions as state updaters
      setFabHandler(() => handler);
    },
    []
  );

  return (
    <FabContext.Provider value={{ registerFabHandler }}>
      <div className="flex min-h-screen bg-muted/20">
        {/* 
          This wrapper is the "mobile frame".
          It restricts width on desktop to mimic a phone, and takes full width on mobile.
        */}
        <div className="mx-auto flex w-full max-w-md flex-col bg-background pb-safe shadow-sm ring-1 ring-border/50">
          
          {/* Global Mobile Header */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-5 pt-safe backdrop-blur-md">
            <BrandMark />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={signoutMutation.isPending}
                onClick={() => signoutMutation.mutate()}
              >
                {signoutMutation.isPending ? <Spinner /> : <LogOutIcon className="size-5" />}
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden pb-16">
            <Outlet />
          </main>
        </div>

        <BottomNav onFabClick={fabHandler ?? undefined} />
      </div>
    </FabContext.Provider>
  );
}
