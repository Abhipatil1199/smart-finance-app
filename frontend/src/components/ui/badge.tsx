import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-normal transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success:
          "bg-success/10 text-success dark:bg-success/15",
        warning:
          "bg-warning/10 text-warning dark:bg-warning/15",
        destructive:
          "bg-destructive/10 text-destructive dark:bg-destructive/15",
        outline:
          "border border-border bg-transparent text-muted-foreground",
        muted:
          "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
