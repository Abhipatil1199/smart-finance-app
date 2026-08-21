import { MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/app/providers/use-theme";

/**
 * Flips between light and dark. Choosing an explicit value also opts the user
 * out of following the OS from that point on, which is the behaviour people
 * expect from a single-press toggle.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xl"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className={cn("text-muted-foreground hover:text-foreground", className)}
    >
      <SunIcon aria-hidden="true" className="size-5 dark:hidden" />
      <MoonIcon aria-hidden="true" className="hidden size-5 dark:block" />
    </Button>
  );
}
