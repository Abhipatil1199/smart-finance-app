import { BriefcaseIcon } from "lucide-react";

import type { IncomeSource } from "@/features/income/types/income.types";

interface BentoTopSourceProps {
  sources: IncomeSource[];
}

/**
 * Small bento card — Top income source.
 * Finds the source with the highest percentage and displays its label.
 */
export function BentoTopSource({ sources }: BentoTopSourceProps) {
  const top = sources.reduce(
    (best, s) => (s.percentage > best.percentage ? s : best),
    sources[0]
  );

  if (!top) return null;

  return (
    <div className="bento-card col-span-1 flex flex-col items-center justify-center p-4 text-center">
      <span className="mb-1 grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
        <BriefcaseIcon className="size-4" />
      </span>
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
        Top Source
      </p>
      <p className="font-heading text-sm font-bold text-foreground">
        {top.label}
      </p>
    </div>
  );
}
