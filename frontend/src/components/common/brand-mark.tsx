import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Hides the wordmark, leaving only the glyph. */
  iconOnly?: boolean;
  /** Renders for placement on the dark brand panel rather than a page surface. */
  onBrand?: boolean;
};

/**
 * The Smart Finance logo: an upward chart stroke inside a rounded tile,
 * drawn with `currentColor` so it inherits whatever surface it sits on.
 */
export function BrandMark({ className, iconOnly = false, onBrand = false }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "grid size-9 place-items-center rounded-[0.6rem] shadow-sm ring-1",
          onBrand
            ? "bg-white/12 text-white ring-white/20"
            : "bg-gradient-to-br from-brand to-brand-strong text-white ring-black/5"
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-5">
          <path
            d="M4 16.5 9 11l3.5 3.5L20 7"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 7h5v5"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!iconOnly ? (
        <span
          className={cn(
            "font-heading text-[1.0625rem] leading-none font-semibold tracking-tight",
            onBrand ? "text-white" : "text-foreground"
          )}
        >
          Smart Finance
        </span>
      ) : null}
    </span>
  );
}
