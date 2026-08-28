import { useMemo, useId } from "react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IncomeTrendPoint } from "@/features/income/types/income.types";

interface IncomeTrendChartProps {
  data: IncomeTrendPoint[];
  className?: string;
}

/**
 * Hand-drawn SVG area chart showing income trend over the last 6 months.
 * No charting library — keeps the bundle small. Uses a smooth cubic Bézier
 * path with a gradient fill and animated draw-in.
 */
export function IncomeTrendChart({ data, className }: IncomeTrendChartProps) {
  const gradientId = useId();

  const { pathD, areaD, points, maxY } = useMemo(() => {
    if (data.length === 0) return { pathD: "", areaD: "", points: [], maxY: 0 };

    const maxAmount = Math.max(...data.map((d) => d.amount));
    // Add 20% headroom so the top point doesn't clip
    const yMax = maxAmount * 1.2;

    const W = 400;
    const H = 160;
    const padX = 30;
    const padY = 20;
    const innerW = W - padX * 2;
    const innerH = H - padY * 2;

    const pts = data.map((d, i) => ({
      x: padX + (i / (data.length - 1)) * innerW,
      y: padY + innerH - (d.amount / yMax) * innerH,
      label: d.month,
      amount: d.amount,
    }));

    // Build a smooth cubic Bézier path through the points
    let line = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      line += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }

    // Closed area for the gradient fill
    const area =
      line +
      ` L${pts[pts.length - 1].x},${H - padY} L${pts[0].x},${H - padY} Z`;

    return { pathD: line, areaD: area, points: pts, maxY: yMax };
  }, [data]);

  if (data.length === 0) return null;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Income Trend</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <svg
          viewBox="0 0 400 160"
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Income trend line chart"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(var(--chart-1))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="oklch(var(--chart-1))" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((frac) => {
            const y = 20 + 120 * (1 - frac);
            return (
              <line
                key={frac}
                x1="30"
                y1={y}
                x2="370"
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="4 4"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Gradient fill area */}
          <path
            d={areaD}
            fill={`url(#${gradientId})`}
            className="animate-[fadeIn_0.8s_ease-out]"
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-chart-1 animate-[drawLine_1s_ease-out]"
            style={{ strokeDasharray: 1000, strokeDashoffset: 0 }}
          />

          {/* Data points + labels */}
          {points.map((pt, i) => (
            <g key={i}>
              {/* Outer ring */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                className="fill-card stroke-chart-1"
                strokeWidth="2"
              />
              {/* Inner dot */}
              <circle cx={pt.x} cy={pt.y} r="2" className="fill-chart-1" />
              {/* Month label */}
              <text
                x={pt.x}
                y={155}
                textAnchor="middle"
                className="fill-muted-foreground text-[0.625rem]"
              >
                {pt.label}
              </text>
              {/* Amount tooltip on hover — CSS-only */}
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                className="fill-foreground text-[0.5rem] font-semibold opacity-0 transition-opacity group-hover/card:opacity-100"
              >
                ₹{(pt.amount / 1000).toFixed(0)}k
              </text>
            </g>
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}
