import { useState, useEffect } from "react";
import { XIcon, CalendarIcon, Loader2Icon, PencilIcon, CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  Transaction,
  TransactionType,
} from "@/features/dashboard/types/transaction.types";
import type { IncomeFrequency } from "@/features/income/types/income.types";

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (payload: {
    id: string;
    rawId?: number;
    type: TransactionType;
    amount: number;
    source: string;
    frequency: IncomeFrequency;
    date: string;
    description?: string;
  }) => Promise<void> | void;
  isSubmitting?: boolean;
}

const FREQUENCIES: { value: IncomeFrequency; label: string }[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "ONE_TIME", label: "One-Time" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "DAILY", label: "Daily" },
];

const INCOME_SOURCES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Rental",
  "Bonus",
  "Other Income",
];

export function EditTransactionModal({
  isOpen,
  transaction,
  onClose,
  onSave,
  isSubmitting = false,
}: EditTransactionModalProps) {
  const [amountStr, setAmountStr] = useState("");
  const [source, setSource] = useState("");
  const [frequency, setFrequency] = useState<IncomeFrequency>("MONTHLY");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (transaction) {
      setAmountStr(String(transaction.amount || ""));
      setSource(transaction.title || "");
      setFrequency(
        (transaction.frequency as IncomeFrequency) || "MONTHLY"
      );
      setDate(transaction.date || new Date().toISOString().split("T")[0]);
      setDescription(transaction.description || "");
      setErrorMsg("");
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountStr);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg("Please enter a valid amount greater than 0");
      return;
    }
    if (!source.trim()) {
      setErrorMsg("Source/Category name is required");
      return;
    }

    try {
      await onSave({
        id: transaction.id,
        rawId: transaction.rawId,
        type: transaction.type,
        amount: numAmount,
        source: source.trim(),
        frequency,
        date,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update transaction");
    }
  };

  const isIncome = transaction.type === "income";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Sheet / Modal Dialog */}
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card border border-border p-6 shadow-2xl z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <PencilIcon className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Edit {isIncome ? "Income" : "Transaction"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Update details and save changes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition focus:outline-none"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mt-3 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs font-semibold text-destructive">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Amount
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-lg font-bold text-foreground">
                ₹
              </span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-border bg-background py-3 pl-8 pr-4 text-xl font-extrabold text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Source / Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Category / Source
            </label>
            {/* Quick Source Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {INCOME_SOURCES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition",
                    source.toLowerCase() === s.toLowerCase()
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. Salary, Freelance"
              className="w-full rounded-xl border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
              required
            />
          </div>

          {/* Frequency (for Income) */}
          {isIncome && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Frequency
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFrequency(f.value)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                      frequency === f.value
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Date
            </label>
            <div className="relative flex items-center">
              <CalendarIcon className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
                required
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Project bonus, monthly payroll"
              className="w-full rounded-xl border border-border bg-background py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/3 rounded-xl border border-border bg-muted/60 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted transition active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTransactionModal;
