import { useState, useId, useRef, useEffect } from "react";
import {
  XIcon,
  CalendarIcon,
  PencilIcon,
  ChevronDownIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  TransactionCategoryItem,
  NewTransactionPayload,
} from "@/features/transactions/types/category.types";
import type { IncomeFrequency } from "@/features/income/types/income.types";
import { NumericKeypad } from "@/features/transactions/components/numeric-keypad";

export interface AddDetailsInitialValues {
  amount?: number;
  frequency?: IncomeFrequency;
  account?: string;
  date?: string;
  description?: string;
  /** Local transaction id — present when editing */
  editId?: string;
  /** Backend numeric id — present when editing a real income record */
  rawId?: number;
}

interface AddDetailsSheetProps {
  category: TransactionCategoryItem;
  isOpen: boolean;
  onClose: () => void;
  onChangeCategory: () => void;
  onSubmit: (payload: NewTransactionPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  initialValues?: AddDetailsInitialValues;
  isEditMode?: boolean;
}

const FREQUENCIES: { value: IncomeFrequency; label: string }[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "ONE_TIME", label: "One-time" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "DAILY", label: "Daily" },
];

const ACCOUNTS = [
  { id: "hdfc", label: "HDFC Primary", dot: "bg-emerald-500" },
  { id: "cash", label: "Cash", dot: "bg-amber-500" },
  { id: "card", label: "Credit Card", dot: "bg-purple-500" },
  { id: "upi", label: "UPI Wallet", dot: "bg-sky-500" },
];

/**
 * Add Details Bottom Sheet matching the Stitch UI design.
 * Features an interactive editable amount display, detail pills, note input,
 * and an on-screen mobile numeric keypad. Supports both adding and editing.
 */
export function AddDetailsSheet({
  category,
  isOpen,
  onClose,
  onChangeCategory,
  onSubmit,
  isSubmitting = false,
  initialValues,
  isEditMode = false,
}: AddDetailsSheetProps) {
  const [amountStr, setAmountStr] = useState(() =>
    initialValues?.amount ? String(initialValues.amount) : ""
  );
  const [frequency, setFrequency] = useState<IncomeFrequency>(
    () => initialValues?.frequency || "MONTHLY"
  );
  const [account, setAccount] = useState(
    () => initialValues?.account || "HDFC Primary"
  );
  const [date, setDate] = useState(
    () => initialValues?.date || new Date().toISOString().split("T")[0]
  );
  const [description, setDescription] = useState(
    () => initialValues?.description || ""
  );
  const [isFreqOpen, setIsFreqOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dateInputId = useId();
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    isSubmittingRef.current = false;
    if (initialValues) {
      if (initialValues.amount !== undefined) {
        setAmountStr(String(initialValues.amount));
      }
      if (initialValues.frequency) setFrequency(initialValues.frequency);
      if (initialValues.account) setAccount(initialValues.account);
      if (initialValues.date) setDate(initialValues.date);
      if (initialValues.description !== undefined) {
        setDescription(initialValues.description || "");
      }
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const isIncome = category.type === "income";
  const Icon = category.icon;

  // Keypad Handlers
  const handleDigit = (digit: string) => {
    if (digit === "+") return;

    if ((!amountStr || amountStr === "0") && digit !== ".") {
      setAmountStr(digit);
    } else {
      if (digit === "." && amountStr.includes(".")) return;
      if (amountStr.length < 9) {
        setAmountStr((prev) => prev + digit);
      }
    }
  };

  const handleBackspace = () => {
    if (amountStr.length > 1) {
      setAmountStr((prev) => prev.slice(0, -1));
    } else {
      setAmountStr("");
    }
  };

  const handleSave = () => {
    if (isSubmitting || isSubmittingRef.current) return;
    const numericAmount = parseFloat(amountStr) || 0;
    if (numericAmount <= 0) return;

    isSubmittingRef.current = true;
    onSubmit({
      type: category.type,
      category: category.label,
      amount: numericAmount,
      date,
      frequency: isIncome ? frequency : undefined,
      account: !isIncome ? account : undefined,
      description: description.trim() || undefined,
      editId: initialValues?.editId,
      rawId: initialValues?.rawId,
    });
  };

  // Format date display (e.g. "Today, 28 Aug" or "28 Aug 2026")
  const formatDateDisplay = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0];
    const d = new Date(dateString + "T00:00:00");
    const formatted = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    return dateString === today ? `Today, ${formatted}` : formatted;
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Card */}
      <section
        data-purpose="transaction-detail-bottom-sheet"
        className={cn(
          "relative z-50 flex w-full flex-col rounded-t-[32px] border-t border-border/80",
          "bg-card text-card-foreground shadow-2xl transition-all duration-200",
          "animate-in slide-in-from-bottom-6 pb-6 pt-3"
        )}
      >
        {/* Pull Bar Indicator */}
        <div
          className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30"
          data-purpose="sheet-handle"
        />

        {/* Sheet Header: Category info & dismiss */}
        <div className="flex items-center justify-between border-b border-border/60 px-5 pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-2xl shadow-sm",
                category.bgClass,
                category.textClass
              )}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold leading-none text-foreground">
                  {category.label}
                </h2>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    isIncome
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                  )}
                >
                  {isEditMode
                    ? isIncome
                      ? "Edit Income"
                      : "Edit Expense"
                    : isIncome
                    ? "Income"
                    : "Expense"}
                </span>
              </div>
              <button
                type="button"
                onClick={onChangeCategory}
                className="mt-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Change category
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss sheet"
            className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition hover:bg-muted/80 hover:text-foreground active:scale-95"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Editable Amount Input Display */}
        <div className="px-5 pb-2 pt-3 text-center" data-purpose="amount-spent-container">
          <label
            htmlFor="transaction-amount-input"
            className="block text-[11px] font-bold tracking-wider uppercase text-muted-foreground cursor-pointer select-none"
          >
            {isIncome ? "Amount Received" : "Amount Spent"}
          </label>
          <div className="mt-1 flex items-center justify-center font-extrabold tracking-tight text-foreground">
            <span className="mr-1 text-2xl font-semibold text-muted-foreground select-none">₹</span>
            <input
              id="transaction-amount-input"
              type="text"
              inputMode="decimal"
              value={amountStr}
              placeholder="0"
              autoFocus
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, "");
                if (val.split(".").length > 2) return;
                setAmountStr(val);
              }}
              className="w-52 bg-transparent text-center text-4xl font-extrabold tracking-tight text-foreground placeholder:text-muted-foreground/30 focus:outline-none border-none"
            />
          </div>
        </div>

        {/* Form Details Row: Account/Frequency pill, Date pill, Note input */}
        <div className="space-y-2.5 px-5 pt-1" data-purpose="form-fields">
          <div className="grid grid-cols-2 gap-2">
            {/* Account / Frequency Pill */}
            {isIncome ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFreqOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate text-xs font-semibold text-foreground">
                      {FREQUENCIES.find((f) => f.value === frequency)?.label}
                    </span>
                  </div>
                  <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground ml-1" />
                </button>

                {isFreqOpen && (
                  <div className="absolute left-0 top-full z-30 mt-1 w-full rounded-xl border border-border bg-popover p-1 shadow-lg">
                    {FREQUENCIES.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => {
                          setFrequency(f.value);
                          setIsFreqOpen(false);
                        }}
                        className={cn(
                          "w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                          frequency === f.value
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate text-xs font-semibold text-foreground">
                      {account}
                    </span>
                  </div>
                  <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground ml-1" />
                </button>

                {isAccountOpen && (
                  <div className="absolute left-0 top-full z-30 mt-1 w-full rounded-xl border border-border bg-popover p-1 shadow-lg">
                    {ACCOUNTS.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => {
                          setAccount(acc.label);
                          setIsAccountOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors",
                          account === acc.label
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className={cn("size-2 rounded-full shrink-0", acc.dot)} />
                        <span>{acc.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Date Selector Pill */}
            <div className="relative">
              <label
                htmlFor={dateInputId}
                className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-muted/50 px-3 py-2 text-left transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <CalendarIcon className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate text-xs font-semibold text-foreground">
                    {formatDateDisplay(date)}
                  </span>
                </div>
                <ChevronDownIcon className="size-3.5 shrink-0 text-muted-foreground ml-1" />
              </label>
              <input
                id={dateInputId}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Description / Note Input Field */}
          <div className="relative flex items-center">
            <PencilIcon className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isIncome
                  ? `Source note (e.g. ${category.label} - Acme Corp)`
                  : `Add note (e.g. ${category.label} weekend sale)...`
              }
              className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-9 pr-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Numeric Keypad Component */}
        <div className="mt-3 px-5">
          <NumericKeypad
            onDigit={handleDigit}
            onBackspace={handleBackspace}
            onSave={handleSave}
            isSaving={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </section>
    </div>
  );
}
