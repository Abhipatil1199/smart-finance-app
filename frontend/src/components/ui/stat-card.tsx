import { TrendingUpIcon, TrendingDownIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  /** Positive = growth, negative = decline. Omit to hide the trend badge. */
  trend?: number;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Glassmorphic summary card for the income dashboard.
 * Shows a metric value with an optional trend badge and icon.
 */
function StatCard({ title, value, trend, icon: Icon, className }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      data-slot="stat-card"
      className={cn(
        "group relative flex flex-col gap-2 overflow-hidden rounded-2xl p-5",
        // Glassmorphic surface
        "bg-card/70 backdrop-blur-xl",
        // Subtle ring + shadow
        "shadow-sm ring-1 ring-foreground/[0.06]",
        // Hover glow
        "transition-all duration-300 hover:shadow-md hover:ring-foreground/10",
        // Gradient shimmer on hover
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500",
        "before:bg-[linear-gradient(135deg,transparent_40%,oklch(0.7_0.12_262/0.06)_50%,transparent_60%)]",
        "hover:before:opacity-100",
        className
      )}
    >
      {/* Top row: title + icon */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon ? (
          <span className="grid size-9 place-items-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-primary/12 dark:bg-primary/12 dark:group-hover:bg-primary/18">
            <Icon className="size-[1.125rem]" />
          </span>
        ) : null}
      </div>

      {/* Value */}
      <span className="font-heading text-2xl font-bold tracking-tight sm:text-[1.75rem]">
        {value}
      </span>

      {/* Trend badge */}
      {trend !== undefined ? (
        <Badge variant={isPositive ? "success" : "destructive"} className="w-fit">
          {isPositive ? (
            <TrendingUpIcon className="size-3" />
          ) : (
            <TrendingDownIcon className="size-3" />
          )}
          {isPositive ? "+" : ""}
          {trend}%
        </Badge>
      ) : null}
    </div>
  );
}

export { StatCard };
export type { StatCardProps };
