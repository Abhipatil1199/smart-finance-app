import { useMemo, useState, useEffect } from "react";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

import type {
  Transaction,
  TransactionGroup,
  TransactionCategory,
  TransactionType,
} from "@/features/dashboard/types/transaction.types";
import type { TabFilter } from "@/features/dashboard/components/category-tabs";
import { TransactionCard } from "@/features/dashboard/components/transaction-card";
import {
  formatINR,
  groupTransactionsByDate,
  MOCK_TRANSACTIONS,
  subscribeTransactions,
  deleteMockTransaction,
} from "@/features/dashboard/data/mock-transactions";
import {
  useIncomes,
  useDeleteIncome,
} from "@/features/income/hooks/useIncome";
import type { Income } from "@/features/income/types/income.types";
import { DeleteConfirmDialog } from "@/features/dashboard/components/delete-confirm-dialog";
import { useFabRegistration } from "@/layouts/app-layout";

interface TransactionTimelineProps {
  /** Active category tab filter ("overview", "expenses", "income", "transfers") */
  activeTab?: TabFilter;
  /** Optional precomputed groups fallback */
  groups?: TransactionGroup[];
}

/**
 * Maps an Income record from GET /api/incomes into a Transaction entity
 * suitable for rendering with TransactionCard, date-grouping, and editing/deleting.
 */
function mapIncomeToTransaction(inc: Income): Transaction {
  // Extract date string YYYY-MM-DD
  const dateStr = inc.date
    ? (inc.date.includes("T") ? inc.date.split("T")[0] : inc.date)
    : new Date().toISOString().split("T")[0];

  // Extract time from createdAt if available
  let timeStr = "";
  if (inc.createdAt) {
    try {
      const d = new Date(inc.createdAt);
      if (!isNaN(d.getTime())) {
        timeStr = d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch {
      timeStr = "";
    }
  }

  // Derive display category for icon styling
  const sourceLower = (inc.source || "").toLowerCase().trim();
  let category: TransactionCategory = "salary";
  if (sourceLower.includes("salar")) {
    category = "salary";
  } else if (
    sourceLower.includes("freelanc") ||
    sourceLower.includes("part-time") ||
    sourceLower.includes("part time")
  ) {
    category = "freelance";
  } else if (sourceLower.includes("business")) {
    category = "business";
  } else if (
    sourceLower.includes("invest") ||
    sourceLower.includes("dividend") ||
    sourceLower.includes("mutual")
  ) {
    category = "investment";
  } else if (sourceLower.includes("rent")) {
    category = "rental";
  } else if (sourceLower.includes("gift")) {
    category = "gift";
  } else if (sourceLower.includes("bonus") || sourceLower.includes("incentive")) {
    category = "bonus";
  } else {
    category = "salary";
  }

  const frequencyLabel = inc.frequency
    ? inc.frequency.charAt(0) + inc.frequency.slice(1).toLowerCase()
    : "Income";

  const subtitle = inc.description
    ? (timeStr ? `${inc.description} • ${timeStr}` : inc.description)
    : (timeStr ? `${frequencyLabel} • ${timeStr}` : `${frequencyLabel} • Direct deposit`);

  return {
    id: `income-${inc.id}`,
    rawId: inc.id,
    title: inc.source || "Income",
    subtitle,
    amount: Number(inc.amount) || 0,
    type: "income",
    category,
    date: dateStr,
    time: timeStr || "Credited",
    status: "Received",
    frequency: inc.frequency,
    description: inc.description || "",
  };
}

/**
 * Date-grouped transaction timeline matching the Stitch design.
 * Features live incomes from backend API (GET /api/incomes), 3-dots action
 * menu for Edit (PUT /api/incomes/:id) and Delete (DELETE /api/incomes/:id).
 */
export function TransactionTimeline({
  activeTab = "overview",
  groups: propGroups,
}: TransactionTimelineProps) {
  // Fetch live incomes from backend API
  const {
    data: incomes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useIncomes();

  // Delete mutation for backend incomes
  const deleteIncomeMutation = useDeleteIncome();

  // Dialog state for delete confirmation
  const [deletingTxn, setDeletingTxn] = useState<Transaction | null>(null);

  // Use global edit modal from AppLayout
  const { openEditTransaction } = useFabRegistration();

  // Listen to local mock transactions (expenses & transfers) updates
  const [tick, setTick] = useState(0);
  useEffect(() => {
    return subscribeTransactions(() => setTick((t) => t + 1));
  }, []);

  // Map API incomes into Transaction models
  const incomeTransactions = useMemo(() => {
    return incomes.map(mapIncomeToTransaction);
  }, [incomes]);

  // Non-income mock transactions (expenses and transfers)
  const nonIncomeTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((t) => t.type !== "income");
  }, [tick]);

  // Merge and filter transactions according to active category tab
  const displayGroups = useMemo(() => {
    let filtered: Transaction[] = [];

    if (activeTab === "income") {
      filtered = incomeTransactions;
    } else if (activeTab === "expense") {
      filtered = nonIncomeTransactions.filter((t) => t.type === "expense");
    } else if (activeTab === "transfer") {
      filtered = nonIncomeTransactions.filter((t) => t.type === "transfer");
    } else {
      // "overview" or default — show both real incomes and expenses
      filtered = [...incomeTransactions, ...nonIncomeTransactions];
    }

    if (filtered.length === 0 && propGroups && propGroups.length > 0 && incomes.length === 0) {
      return propGroups;
    }

    return groupTransactionsByDate(filtered);
  }, [incomeTransactions, nonIncomeTransactions, activeTab, propGroups, incomes.length]);



  // ── Handle Delete Confirmation ──────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!deletingTxn) return;

    try {
      if (deletingTxn.type === "income" && deletingTxn.rawId) {
        // Call backend DELETE /api/incomes/:id
        await deleteIncomeMutation.mutateAsync(deletingTxn.rawId);
      } else {
        // Delete from local mock transactions
        deleteMockTransaction(deletingTxn.id);
      }
      setDeletingTxn(null);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  // ── Loading Shimmer State ───────────────────────────────────────────
  if (isLoading) {
    return (
      <section
        className="space-y-4 pt-1"
        data-purpose="transaction-timeline-loading"
        aria-busy="true"
        aria-label="Loading transactions"
      >
        <div className="flex items-center justify-between pb-2 pt-2">
          <div className="h-4 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-3.5 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-11 w-11 animate-pulse rounded-2xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="ml-auto h-3 w-12 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ── Error State with Retry ───────────────────────────────────────────
  if (isError && incomeTransactions.length === 0 && (!propGroups || propGroups.length === 0)) {
    return (
      <div className="my-4 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <AlertCircleIcon className="h-8 w-8 text-destructive" />
        <p className="mt-2 text-sm font-semibold text-foreground">
          Unable to load income records
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {error?.message || "Please check your network or server connection."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 inline-flex items-center space-x-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:opacity-90 active:scale-95"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────
  if (displayGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No transactions found
        </p>
        <p className="mt-1 text-xs text-muted-foreground/70">
          Transactions will appear here once recorded.
        </p>
      </div>
    );
  }

  // ── Populated Date Groups ────────────────────────────────────────────
  return (
    <>
      <section className="space-y-4 pt-1" data-purpose="transaction-timeline">
        {displayGroups.map((group, index) => (
          <div key={group.date} className={index > 0 ? "pt-2" : undefined}>
            {/* ── Date Group Header ──────────────────────────────────── */}
            <div className="flex items-center justify-between pb-2 pt-2 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-foreground">
                  {group.dateLabel}
                </span>
                <span className="font-medium text-muted-foreground">
                  {group.dayName}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-muted-foreground">
                <span>
                  Expenses:{" "}
                  <strong className="font-bold text-foreground">
                    {formatINR(group.totalExpenses)}
                  </strong>
                </span>
                <span className="mx-1.5 text-border">•</span>
                <span>
                  Income:{" "}
                  <strong className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(group.totalIncome)}
                  </strong>
                </span>
              </div>
            </div>

            {/* ── Transaction Cards Stack ────────────────────────────── */}
            <div className="space-y-2.5">
              {group.transactions.map((txn) => (
                <TransactionCard
                  key={txn.id}
                  transaction={txn}
                  onEdit={(t) => openEditTransaction(t)}
                  onDelete={(t) => setDeletingTxn(t)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Delete Confirmation Dialog ────────────────────────────────── */}
      <DeleteConfirmDialog
        isOpen={!!deletingTxn}
        transaction={deletingTxn}
        onClose={() => setDeletingTxn(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteIncomeMutation.isPending}
      />
    </>
  );
}

export default TransactionTimeline;
