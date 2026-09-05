import { useState } from "react";
import {
  CalendarIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowDownRightIcon,
  ArrowUpRightIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { MonthSummary } from "@/features/dashboard/types/transaction.types";
import type { TabFilter } from "@/features/dashboard/components/category-tabs";
import { formatINR } from "@/features/dashboard/data/mock-transactions";

interface MonthOverviewCardProps {
  summary: MonthSummary;
  activeTab?: TabFilter;
  incomeEntriesCount?: number;
  averageIncome?: number;
}

/**
 * Dark slate-900 summary card with month selector, trend badge,
 * net balance hero display, and expense/income sub-cards.
 * When in Income tab, adapts to the Stitch "Home Filtered Income View"
 * showing TOTAL RECEIVED, Entries count, and Avg/Entry.
 */
export function MonthOverviewCard({
  summary,
  activeTab = "overview",
  incomeEntriesCount = 0,
  averageIncome = 0,
}: MonthOverviewCardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const isSurplus = summary.balanceStatus === "surplus";
  const trendPositive = summary.trendPercentage >= 0;
  const isIncomeView = activeTab === "income";

  return (
    <section
      data-purpose="summary-banner"
      className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900 p-5 text-white shadow-2xl dark:border-slate-600/40 dark:bg-slate-950"
    >
      {/* ── Ambient background glow accents ─────────────────────────── */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-6 h-36 w-36 rounded-full bg-emerald-400/10 blur-2xl" />

      {/* ── Top Row: Month Selector & Trend Badge ───────────────────── */}
      <div className="relative z-20 mb-4 flex items-center justify-between">
        {/* Month Selector Pill */}
        <button
          type="button"
          className="group inline-flex items-center space-x-2 rounded-2xl border border-slate-700/60 bg-slate-800/90 px-3.5 py-1.5 text-left shadow-inner transition active:scale-95 hover:bg-slate-700/80"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700/60 text-slate-300">
            <CalendarIcon className="h-3 w-3" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              {summary.year}
            </span>
            <span className="text-xs font-bold text-white">
              {summary.month}
            </span>
          </div>
          <ChevronDownIcon className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-slate-200 ml-0.5" />
        </button>

        {/* Trend Badge */}
        <div
          className={cn(
            "inline-flex items-center space-x-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
            trendPositive
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-400"
          )}
        >
          {trendPositive ? (
            <TrendingUpIcon className="h-3 w-3" />
          ) : (
            <TrendingDownIcon className="h-3 w-3" />
          )}
          <span>
            {trendPositive ? "+" : ""}
            {summary.trendPercentage}% vs last mo
          </span>
        </div>
      </div>

      {/* ── Center / Hero Display ──────────────────────────────────── */}
      {isIncomeView ? (
        <div className="relative z-20 mb-4 pt-1 pb-2 text-left">
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            TOTAL RECEIVED
          </span>
          <div className="text-3xl font-extrabold tracking-tight text-emerald-400">
            +{formatINR(summary.totalIncome)}
          </div>
        </div>
      ) : (
        <div className="relative z-20 mb-5 text-left">
          <div className="mb-1 flex items-center space-x-1.5 text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Net Balance
            </span>
            <button
              type="button"
              aria-label="Toggle balance visibility"
              className="text-slate-400 transition hover:text-slate-300 focus:outline-none"
              onClick={() => setBalanceVisible((v) => !v)}
            >
              {balanceVisible ? (
                <EyeIcon className="h-3.5 w-3.5" />
              ) : (
                <EyeOffIcon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold leading-none tracking-tight text-white">
              {balanceVisible
                ? `${isSurplus ? "+" : "-"}${formatINR(Math.abs(summary.netBalance))}`
                : "₹•••••"}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-xs font-semibold",
                isSurplus
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/20 bg-rose-500/10 text-rose-400"
              )}
            >
              {isSurplus ? "Surplus" : "Deficit"}
            </span>
          </div>
        </div>
      )}

      {/* ── Bottom Row: Sub-Cards ──────────────────────────────────── */}
      {isIncomeView ? (
        <div className="relative z-20 grid grid-cols-2 gap-3 border-t border-slate-700/50 pt-3">
          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/60 p-2.5">
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Entries
            </span>
            <span className="text-base font-bold text-white">
              {incomeEntriesCount}{" "}
              {incomeEntriesCount === 1 ? "Transaction" : "Transactions"}
            </span>
          </div>
          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/60 p-2.5">
            <span className="block text-[10px] font-semibold uppercase text-slate-400">
              Avg / Entry
            </span>
            <span className="text-base font-bold text-white">
              {formatINR(averageIncome)}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative z-20 grid grid-cols-2 gap-3 border-t border-slate-700/50 pt-3">
          {/* Expenses sub-card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700/40 bg-slate-800/60 p-3 shadow-inner transition hover:bg-slate-800/90">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="text-xs font-medium text-slate-400">
                  Expenses
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-400/10 text-rose-400">
                <ArrowDownRightIcon className="h-3 w-3" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-lg font-extrabold tracking-tight text-white">
              {formatINR(summary.totalExpenses)}
            </div>
          </div>

          {/* Income sub-card */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-700/40 bg-slate-800/60 p-3 shadow-inner transition hover:bg-slate-800/90">
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400">
                  Income
                </span>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                <ArrowUpRightIcon className="h-3 w-3" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-lg font-extrabold tracking-tight text-emerald-400">
              {formatINR(summary.totalIncome)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MonthOverviewCard;
