import {
  SunIcon,
  MoonIcon,
  LogOutIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout-mutation";
import { useTheme } from "@/app/providers/use-theme";

interface CashbookMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Top-left corner navigation menu.
 * Theme-aware (adapts dynamically to light and dark modes).
 * Contains only Theme and Logout options.
 */
export function CashbookMenu({ isOpen, onClose }: CashbookMenuProps) {
  const { user } = useAuth();
  const signoutMutation = useSignoutMutation();
  const { resolvedTheme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 top-full z-50">
      {/* Backdrop overlay covering the rest of the mobile screen */}
      <div
        className="fixed inset-0 top-[57px] bg-black/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Theme-aware Dropdown Menu Card */}
      <div
        className={cn(
          "relative z-10 w-full overflow-hidden border-b border-border",
          "bg-card text-card-foreground shadow-2xl transition-colors duration-200",
          "animate-in fade-in-0 slide-in-from-top-2"
        )}
      >
        <div className="space-y-2 px-5 py-4">
          {/* User Profile Header if authenticated */}
          {user && (
            <div className="flex items-center space-x-3 rounded-xl bg-muted/60 p-3 border border-border/60">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-xs">
                {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-all hover:bg-muted active:scale-[0.99] border border-border/40 hover:border-border"
          >
            <div className="flex items-center space-x-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {resolvedTheme === "dark" ? (
                  <MoonIcon className="size-5 text-sky-500 dark:text-sky-400" />
                ) : (
                  <SunIcon className="size-5 text-amber-500" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">Theme</h4>
                <p className="text-xs text-muted-foreground">
                  Currently in {resolvedTheme === "dark" ? "Dark" : "Light"} mode
                </p>
              </div>
            </div>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground border border-border/60">
              {resolvedTheme === "dark" ? "Switch to Light" : "Switch to Dark"}
            </span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            disabled={signoutMutation.isPending}
            onClick={() => signoutMutation.mutate()}
            className="flex w-full items-center justify-between rounded-xl p-3 text-left transition-all hover:bg-destructive/10 active:scale-[0.99] text-destructive border border-destructive/20 hover:border-destructive/40"
          >
            <div className="flex items-center space-x-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                {signoutMutation.isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <LogOutIcon className="size-5" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-destructive">Sign out</h4>
                <p className="text-xs text-muted-foreground">
                  Log out of this device
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-destructive">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CashbookMenu;
