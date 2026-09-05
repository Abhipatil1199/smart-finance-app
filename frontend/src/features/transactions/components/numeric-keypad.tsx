import { DeleteIcon, CheckIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface NumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSave: () => void;
  isSaving?: boolean;
  disabled?: boolean;
}

/**
 * Mobile-optimised 4x4 numeric keypad with a tactile 2-row spanning SAVE button
 * and soft-red backspace key matching Stitch UI specifications.
 */
export function NumericKeypad({
  onDigit,
  onBackspace,
  onSave,
  isSaving = false,
  disabled = false,
}: NumericKeypadProps) {
  return (
    <div
      className="grid grid-cols-4 gap-2 select-none"
      data-purpose="numeric-keypad"
    >
      {/* Row 1 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("1")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        1
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("2")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        2
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("3")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        3
      </button>
      {/* Backspace Key */}
      <button
        type="button"
        disabled={disabled}
        onClick={onBackspace}
        aria-label="Backspace"
        className="flex h-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 transition-all hover:bg-rose-500/20 active:scale-95 active:bg-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400"
      >
        <DeleteIcon className="size-5" />
      </button>

      {/* Row 2 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("4")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        4
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("5")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        5
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("6")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        6
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("+")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-base font-semibold text-muted-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        +
      </button>

      {/* Row 3 & 4 with Spanning SAVE Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("7")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        7
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("8")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        8
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("9")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        9
      </button>

      {/* 2-Row Spanning SAVE Button */}
      <button
        type="button"
        disabled={disabled || isSaving}
        onClick={onSave}
        className={cn(
          "row-span-2 flex flex-col items-center justify-center rounded-2xl",
          "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-all",
          "hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50",
          "dark:bg-emerald-600 dark:hover:bg-emerald-500"
        )}
      >
        {isSaving ? (
          <Spinner className="size-6 text-white" />
        ) : (
          <>
            <CheckIcon className="mb-0.5 size-6 stroke-[3]" />
            <span className="text-xs font-extrabold tracking-wider uppercase">
              Save
            </span>
          </>
        )}
      </button>

      {/* Row 4 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("00")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        00
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit("0")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-lg font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        0
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDigit(".")}
        className="flex h-11 items-center justify-center rounded-xl bg-muted/80 text-xl font-bold text-foreground transition-all hover:bg-muted active:scale-95 active:bg-muted/60"
      >
        .
      </button>
    </div>
  );
}
