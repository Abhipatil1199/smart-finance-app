import { SparklesIcon } from "lucide-react";

import type { IncomeRecord } from "@/features/income/types/income.types";

interface BentoProjectedProps {
  records: IncomeRecord[];
}

/** Formats a number as ₹X,XX,XXX (Indian numbering). */
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Computes a rough projected income for the current month based on
 * recurring income records.
 */
function computeProjected(records: IncomeRecord[]): number {
  return records.reduce((total, r) => {
    switch (r.frequency) {
      case "DAILY":
        return total + r.amount * 30;
      case "WEEKLY":
        return total + r.amount * 4;
      case "MONTHLY":
        return total + r.amount;
      case "YEARLY":
        return total + r.amount / 12;
      default:
        return total;
    }
  }, 0);
}

/**
 * Half-width bento card — Projected income for the current period.
 * Dashed border style to visually differentiate from actual data.
 */
export function BentoProjected({ records }: BentoProjectedProps) {
  const projected = computeProjected(
    records.filter((r) => r.frequency !== "ONE_TIME")
  );

  return (
    <div className="bento-card col-span-1 flex h-32 flex-col justify-between border-2 border-dashed border-border bg-accent/40 p-4">
      <div>
        <p className="flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
          <SparklesIcon className="size-3" />
          Projected
        </p>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
          {formatINR(Math.round(projected))}
        </h3>
      </div>
      <p className="text-[0.7rem] text-muted-foreground">
        Based on scheduled recurring
      </p>
    </div>
  );
}
