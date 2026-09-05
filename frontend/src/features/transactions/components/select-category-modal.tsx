import { useState, useMemo, useEffect } from "react";
import { XIcon, QrCodeIcon, ZapIcon, InfoIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  TransactionCategoryItem,
  TransactionTypeTab,
  NewTransactionPayload,
} from "@/features/transactions/types/category.types";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  TRANSFER_CATEGORIES,
} from "@/features/transactions/data/categories.data";
import { AddDetailsSheet } from "@/features/transactions/components/add-details-sheet";

import type { Transaction } from "@/features/dashboard/types/transaction.types";
import type { IncomeFrequency } from "@/features/income/types/income.types";

interface SelectCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NewTransactionPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  editTransaction?: Transaction | null;
}

/**
 * Full-screen Category Selection modal matching Stitch UI.
 * Features Expense, Income, and Transfer segmented tabs,
 * a 4-column category grid, and opens the AddDetailsSheet upon category tap.
 * When editTransaction is passed, opens directly with the pre-selected category and values.
 */
export function SelectCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  editTransaction,
}: SelectCategoryModalProps) {
  const [activeTab, setActiveTab] = useState<TransactionTypeTab>("expense");
  const [selectedCategory, setSelectedCategory] =
    useState<TransactionCategoryItem | null>(null);

  // Initialize selectedCategory and activeTab when editing
  useEffect(() => {
    if (isOpen && editTransaction) {
      const typeTab: TransactionTypeTab =
        editTransaction.type === "income"
          ? "income"
          : editTransaction.type === "transfer"
          ? "transfer"
          : "expense";
      setActiveTab(typeTab);

      const list =
        typeTab === "income"
          ? INCOME_CATEGORIES
          : typeTab === "transfer"
          ? TRANSFER_CATEGORIES
          : EXPENSE_CATEGORIES;

      const titleLower = (editTransaction.title || "").toLowerCase().trim();
      const catLower = (editTransaction.category || "").toLowerCase().trim();
      const matched =
        list.find(
          (c) =>
            c.label.toLowerCase() === titleLower ||
            c.id.toLowerCase() === catLower ||
            (c.incomeCategory && c.incomeCategory.toLowerCase() === catLower)
        ) || list[0];

      setSelectedCategory(matched);
    } else if (isOpen && !editTransaction) {
      setSelectedCategory(null);
    }
  }, [isOpen, editTransaction]);

  // Active categories list based on tab
  const categories = useMemo(() => {
    switch (activeTab) {
      case "income":
        return INCOME_CATEGORIES;
      case "transfer":
        return TRANSFER_CATEGORIES;
      case "expense":
      default:
        return EXPENSE_CATEGORIES;
    }
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
      {/* Mobile container wrapper */}
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-background text-foreground shadow-2xl pb-safe">
        {/* Top Navigation Bar */}
        <header className="flex shrink-0 items-center justify-between px-5 py-3 pt-safe border-b border-border/60">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80 shadow-xs transition hover:bg-muted active:scale-95"
          >
            <XIcon className="size-5" />
          </button>

          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Select Category
          </h1>

          <button
            type="button"
            aria-label="Quick scan or receipt"
            className="relative flex size-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80 shadow-xs transition hover:bg-muted active:scale-95"
          >
            <QrCodeIcon className="size-5" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 ring-2 ring-card" />
          </button>
        </header>

        {/* Segmented Transaction Type Switcher */}
        <div className="shrink-0 px-5 pt-3 pb-2">
          <div className="flex items-center justify-between gap-1 rounded-2xl bg-muted/70 p-1 text-sm font-medium shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab("expense");
                setSelectedCategory(null);
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 transition-all",
                activeTab === "expense"
                  ? "bg-card font-semibold text-emerald-600 shadow-sm dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeTab === "expense" && (
                <span className="size-2 rounded-full bg-emerald-500" />
              )}
              <span>Expense</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("income");
                setSelectedCategory(null);
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 transition-all",
                activeTab === "income"
                  ? "bg-card font-semibold text-emerald-600 shadow-sm dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeTab === "income" && (
                <span className="size-2 rounded-full bg-emerald-500" />
              )}
              <span>Income</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("transfer");
                setSelectedCategory(null);
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 transition-all",
                activeTab === "transfer"
                  ? "bg-card font-semibold text-emerald-600 shadow-sm dark:text-emerald-400"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {activeTab === "transfer" && (
                <span className="size-2 rounded-full bg-emerald-500" />
              )}
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Section Header */}
        <div className="shrink-0 px-5 pt-1 pb-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>
              {activeTab === "expense" &&
                `All Categories (${categories.length})`}
              {activeTab === "income" &&
                `Income Categories (${categories.length})`}
              {activeTab === "transfer" &&
                `Transfer Categories (${categories.length})`}
            </span>
            <span className="flex items-center gap-1 font-semibold normal-case text-emerald-600 dark:text-emerald-400">
              <ZapIcon className="size-3.5" />
              Tap to proceed
            </span>
          </div>
        </div>

        {/* 4-Column Category Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  data-purpose="category-card"
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl p-2.5 transition-all group active:scale-95",
                    "border bg-card shadow-xs hover:border-emerald-500/60",
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/30"
                      : "border-border/70",
                  )}
                >
                  <div
                    className={cn(
                      "mb-1.5 flex size-12 items-center justify-center rounded-2xl shadow-xs transition-transform group-hover:scale-105",
                      cat.bgClass,
                      cat.textClass,
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span className="w-full truncate text-center text-xs font-medium text-foreground">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recurring Income Tip Card (When Income Tab is selected) */}
          {activeTab === "income" && (
            <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-left dark:bg-emerald-950/40">
              <div className="flex items-start gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                  <ZapIcon className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Recurring Income Tip
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-emerald-800/80 dark:text-emerald-300/80">
                    You can set your salary or part-time earnings as a monthly
                    repeating budget rule in Settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Note */}
        <div className="shrink-0 flex items-center justify-center gap-1.5 border-t border-border/40 py-2.5 text-center text-[11px] text-muted-foreground">
          <InfoIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Choose a category to start entering your transaction</span>
        </div>

        {/* Add Details Bottom Sheet (slides up when a category is selected) */}
        {selectedCategory && (
          <AddDetailsSheet
            category={selectedCategory}
            isOpen={!!selectedCategory}
            onClose={() => {
              setSelectedCategory(null);
              if (editTransaction) onClose();
            }}
            onChangeCategory={() => setSelectedCategory(null)}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isEditMode={!!editTransaction}
            initialValues={
              editTransaction
                ? {
                    amount: editTransaction.amount,
                    frequency: editTransaction.frequency as IncomeFrequency | undefined,
                    date: editTransaction.date,
                    description: editTransaction.description || "",
                    editId: editTransaction.id,
                    rawId: editTransaction.rawId,
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}

export default SelectCategoryModal;
