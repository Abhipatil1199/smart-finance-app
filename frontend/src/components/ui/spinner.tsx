import { LoaderCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Decorative by default — the surrounding control is responsible for
 * announcing busy state (e.g. `aria-busy` on a submit button), so the icon
 * itself stays hidden from assistive tech to avoid a duplicate announcement.
 */
function Spinner({ className, ...props }: React.ComponentProps<typeof LoaderCircleIcon>) {
  return (
    <LoaderCircleIcon
      data-slot="spinner"
      aria-hidden="true"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
