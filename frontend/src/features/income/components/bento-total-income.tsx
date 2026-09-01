import { TrendingUpIcon } from "lucide-react";

import type { IncomeSummary, IncomeTrendPoint } from "@/features/income/types/income.types";

interface BentoTotalIncomeProps {
  summary: IncomeSummary;
  trend: IncomeTrendPoint[];
}

/** Formats a number as ₹X,XX,XXX (Indian numbering). */
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

/**
 * Full-width bento hero card — Total Income (YTD).
 * Shows the total income amount, a trend badge, and a CSS-driven sparkline
 * bar chart built from the last few months of trend data.
 */
export function BentoTotalIncome({ summary, trend }: BentoTotalIncomeProps) {
  const maxAmount = Math.max(...trend.map((t) => t.amount), 1);

  return (
    <div className="bento-card col-span-2 flex flex-col overflow-hidden p-5 relative">
      {/* Header row: label + trend badge */}
      <div className="flex items-start justify-between mb-4 z-10">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Total Income (YTD)
          </p>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            {formatINR(summary.totalIncome)}
          </h2>
        </div>
        {summary.totalGrowth !== 0 && (
          <div className="tag-emerald flex items-center gap-1 rounded-full px-2.5 py-1">
            <TrendingUpIcon className="size-3.5" />
            <span className="text-[0.7rem] font-semibold">
              +{summary.totalGrowth}%
            </span>
          </div>
        )}
      </div>

      {/* CSS sparkline bar chart */}
      <div className="relative z-10 mt-auto flex h-16 w-full items-end gap-1 opacity-80">
        {trend.map((point, i) => {
          const height = Math.max((point.amount / maxAmount) * 100, 5);
          const isLast = i === trend.length - 1;
          return (
            <div
              key={point.month}
              className={`w-full rounded-t-sm transition-all duration-500 ${
                isLast
                  ? "bg-success shadow-[0_0_8px_oklch(from_var(--success)_l_c_h_/_50%)]"
                  : "bg-success/30"
              }`}
              style={{
                height: `${height}%`,
                animationDelay: `${i * 60}ms`,
              }}
              title={`${point.month}: ₹${point.amount.toLocaleString("en-IN")}`}
            />
          );
        })}
      </div>
    </div>
  );
}
