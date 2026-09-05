import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IncomeSource } from "@/features/income/types/income.types";
import { CATEGORY_ICONS } from "@/features/income/data/income.mock";

interface IncomeSourcesProps {
  sources: IncomeSource[];
  className?: string;
}

/**
 * Donut ring chart with a breakdown legend showing income source percentages.
 * Pure SVG — no charting library. Animated segment draw-in on mount.
 */
export function IncomeSources({ sources, className }: IncomeSourcesProps) {
  const arcs = useMemo(() => {
    const RADIUS = 52;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    let cumulative = 0;

    return sources.map((s) => {
      const length = (s.percentage / 100) * CIRCUMFERENCE;
      const offset = cumulative;
      cumulative += length;
      return { ...s, length, offset, circumference: CIRCUMFERENCE, radius: RADIUS };
    });
  }, [sources]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Income Sources</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 128 128"
            className="size-32"
            role="img"
            aria-label="Income sources donut chart"
          >
            {arcs.map((arc, i) => (
              <circle
                key={i}
                cx="64"
                cy="64"
                r={arc.radius}
                fill="none"
                strokeWidth="14"
                strokeLinecap="round"
                stroke={arc.color}
                strokeDasharray={`${arc.length - 3} ${arc.circumference}`}
                strokeDashoffset={-arc.offset}
                className="origin-center -rotate-90 transition-all duration-700"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[0.6rem] uppercase tracking-wide text-muted-foreground">
              Sources
            </span>
            <span className="font-heading text-lg font-bold">{sources.length}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-3">
          {sources.map((s) => (
            <div key={s.category} className="flex items-center gap-3">
              {/* Color dot */}
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {/* Icon + label */}
              <span className="text-sm">
                {CATEGORY_ICONS[s.category] ?? "💰"}{" "}
                <span className="font-medium">{s.label}</span>
              </span>
              {/* Percentage */}
              <span className="ml-auto text-sm tabular-nums text-muted-foreground">
                {s.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
