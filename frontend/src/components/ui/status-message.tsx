import { CircleAlertIcon, CircleCheckBigIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusMessageVariants = cva(
  "flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm animate-in fade-in-0 slide-in-from-top-1 duration-200",
  {
    variants: {
      variant: {
        error: "border-destructive/25 bg-destructive/8 text-destructive dark:bg-destructive/12",
        success: "border-success/25 bg-success/8 text-success dark:bg-success/12",
      },
    },
    defaultVariants: {
      variant: "error",
    },
  }
);

const ICONS = {
  error: CircleAlertIcon,
  success: CircleCheckBigIcon,
};

/**
 * Form-level feedback banner.
 *
 * Errors use `role="alert"` so they interrupt and are read immediately;
 * successes use `role="status"`, which is polite and waits for a pause.
 */
function StatusMessage({
  className,
  variant = "error",
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof statusMessageVariants>) {
  const Icon = ICONS[variant ?? "error"];

  return (
    <div
      data-slot="status-message"
      role={variant === "success" ? "status" : "alert"}
      className={cn(statusMessageVariants({ variant }), className)}
      {...props}
    >
      <Icon aria-hidden="true" className="mt-px size-4 shrink-0" />
      <span className="leading-snug text-pretty">{children}</span>
    </div>
  );
}

export { StatusMessage, statusMessageVariants };
