import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { PASSWORD_MIN_LENGTH } from "@/features/auth/schemas/auth.schemas";

const LEVELS = [
  { label: "Weak", bar: "bg-destructive", text: "text-destructive" },
  { label: "Fair", bar: "bg-warning", text: "text-warning" },
  { label: "Good", bar: "bg-chart-3", text: "text-chart-3" },
  { label: "Strong", bar: "bg-success", text: "text-success" },
] as const;

/**
 * A rough, local estimate — deliberately not a substitute for the schema.
 * The schema decides what is *allowed*; this only nudges toward better than
 * the minimum. Nothing here is sent anywhere.
 */
function scorePassword(value: string): number {
  if (!value) return -1;

  let score = 0;
  if (value.length >= PASSWORD_MIN_LENGTH) score += 1;
  if (value.length >= 14) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  // A single repeated or sequential run defeats the character-class checks.
  if (/^(.)\1+$/.test(value) || /0123|1234|2345|abcd|qwer/i.test(value)) score = 1;

  return Math.min(score - 1, LEVELS.length - 1);
}

export function PasswordStrengthMeter({ value, className }: { value: string; className?: string }) {
  const score = useMemo(() => scorePassword(value), [value]);

  if (score < 0) return null;

  const level = LEVELS[Math.max(score, 0)];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div aria-hidden="true" className="flex flex-1 gap-1.5">
        {LEVELS.map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              index <= score ? level.bar : "bg-border"
            )}
          />
        ))}
      </div>
      <p aria-live="polite" className={cn("w-12 text-right text-xs font-medium", level.text)}>
        {level.label}
      </p>
    </div>
  );
}
