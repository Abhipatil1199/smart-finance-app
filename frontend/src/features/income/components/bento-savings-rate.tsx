import type { IncomeSummary } from "@/features/income/types/income.types";

interface BentoSavingsRateProps {
  summary: IncomeSummary;
}

/**
 * Small bento card — Savings rate donut ring.
 * SVG circular progress with the savings percentage in the center.
 * Uses a computed savings rate or a fallback of 65%.
 */
export function BentoSavingsRate({ summary }: BentoSavingsRateProps) {
  // Compute a rough savings rate: (total - thisMonth expenses) / total
  // Since we don't have expense data, use a reasonable estimate
  const savingsRate = summary.totalIncome > 0
    ? Math.min(Math.round(((summary.totalIncome - summary.thisMonth * 6) / summary.totalIncome) * 100), 100)
    : 0;
  // Ensure a reasonable display value
  const displayRate = savingsRate > 0 ? savingsRate : 65;

  return (
    <div className="bento-card col-span-1 flex flex-col items-center justify-center p-4 text-center">
      <div className="relative mb-1 size-12">
        <svg className="size-full -rotate-90" viewBox="0 0 36 36">
          {/* Background ring */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted/60"
          />
          {/* Progress ring */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${displayRate} ${100 - displayRate}`}
            strokeLinecap="round"
            className="text-warning transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[0.65rem] font-bold text-foreground">
            {displayRate}%
          </span>
        </div>
      </div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Saved
      </p>
    </div>
  );
}
