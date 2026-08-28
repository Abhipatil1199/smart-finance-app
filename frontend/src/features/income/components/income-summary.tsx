import { WalletIcon, CalendarIcon, BarChart3Icon } from "lucide-react";

import { StatCard } from "@/components/ui/stat-card";
import type { IncomeSummary as IncomeSummaryType } from "@/features/income/types/income.types";

interface IncomeSummaryProps {
  summary: IncomeSummaryType;
}

/** Formats a number as ₹X,XX,XXX (Indian numbering). */
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

/**
 * Three summary stat cards in a responsive grid.
 * Single column on mobile, three columns on sm+.
 */
export function IncomeSummary({ summary }: IncomeSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title="Total Income"
        value={formatINR(summary.totalIncome)}
        trend={summary.totalGrowth}
        icon={WalletIcon}
      />
      <StatCard
        title="This Month"
        value={formatINR(summary.thisMonth)}
        trend={summary.monthGrowth}
        icon={CalendarIcon}
      />
      <StatCard
        title="Monthly Average"
        value={formatINR(summary.monthlyAverage)}
        icon={BarChart3Icon}
      />
    </div>
  );
}
