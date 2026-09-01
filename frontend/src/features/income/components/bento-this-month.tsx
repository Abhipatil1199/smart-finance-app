import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import type { IncomeSummary } from "@/features/income/types/income.types";

interface BentoThisMonthProps {
  summary: IncomeSummary;
}

/** Formats a number as ₹X,XX,XXX (Indian numbering). */
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Half-width bento card — This Month's income.
 * Shows the current month's total with a growth percentage.
 */
export function BentoThisMonth({ summary }: BentoThisMonthProps) {
  const isPositive = summary.monthGrowth >= 0;

  return (
    <div className="bento-card col-span-1 flex h-32 flex-col justify-between p-4">
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          This Month
        </p>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
          {formatINR(summary.thisMonth)}
        </h3>
      </div>
      <div className="flex items-center gap-1 text-success">
        {isPositive ? (
          <ArrowUpIcon className="size-3.5" />
        ) : (
          <ArrowDownIcon className="size-3.5 text-destructive" />
        )}
        <span className="text-[0.7rem] font-semibold">
          {isPositive ? "+" : ""}
          {summary.monthGrowth}% vs last mo
        </span>
      </div>
    </div>
  );
}
