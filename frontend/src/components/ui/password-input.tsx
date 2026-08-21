import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * Password field with a reveal toggle.
 *
 * The toggle is a 44px square so it stays comfortably tappable, and it is
 * `type="button"` so tapping it never submits the form. Autocomplete is left
 * to the caller — password managers are a security *benefit*, and suppressing
 * them here would push users toward weaker, memorable passwords.
 */
function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      {/* Props are spread first so the settings below cannot be overridden:
          the toggle owns `type`, and the rest are correctness requirements. */}
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        // A revealed password must not reach a remote spellcheck service, and
        // mobile auto-capitalisation silently corrupts the first character.
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="none"
        className={cn("pr-tap", className)}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-pressed={isVisible}
        aria-label={isVisible ? "Hide password" : "Show password"}
        title={isVisible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-tap items-center justify-center rounded-r-md text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 active:text-foreground"
      >
        {isVisible ? (
          <EyeOffIcon aria-hidden="true" className="size-4.5" />
        ) : (
          <EyeIcon aria-hidden="true" className="size-4.5" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
