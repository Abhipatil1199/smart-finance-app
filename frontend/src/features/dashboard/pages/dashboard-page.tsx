import { useState, useMemo, useEffect } from "react";

import { CategoryTabs } from "@/features/dashboard/components/category-tabs";
import type { TabFilter } from "@/features/dashboard/components/category-tabs";
import { MonthOverviewCard } from "@/features/dashboard/components/month-overview-card";
import { TransactionTimeline } from "@/features/dashboard/components/transaction-timeline";
import {
  MOCK_TRANSACTIONS,
  subscribeTransactions,
} from "@/features/dashboard/data/mock-transactions";
import type { MonthSummary } from "@/features/dashboard/types/transaction.types";
import { useIncomes } from "@/features/income/hooks/useIncome";

/**
 * Dashboard home page — matches the Stitch "Home with Sliding Tab Navigation"
 * design. Composes category tabs, a dark summary card, and a date-grouped
 * transaction timeline displaying live backend incomes.
 */
export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>("overview");
  const [, setTick] = useState(0);

  // Subscribe to local mock transactions (expenses & transfers)
  useEffect(() => {
    return subscribeTransactions(() => setTick((t) => t + 1));
  }, []);

  // Live incomes from backend API (GET /api/incomes)
  const { data: incomes = [] } = useIncomes();

  // Dynamic Month Summary derived from live incomes and local expenses
  const summary: MonthSummary = useMemo(() => {
    const totalIncome = incomes.reduce(
      (sum, inc) => sum + (Number(inc.amount) || 0),
      0
    );

    const totalExpenses = MOCK_TRANSACTIONS
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;
    const now = new Date();
    const month = now.toLocaleDateString("en-IN", { month: "short" });
    const year = now.getFullYear();

    return {
      month,
      year,
      netBalance,
      totalIncome,
      totalExpenses,
      trendPercentage: 12.4,
      balanceStatus: netBalance >= 0 ? "surplus" : "deficit",
    };
  }, [incomes]);

  return (
    <div className="flex w-full flex-col">
      {/* ── Sliding Category Tabs ────────────────────────────────────── */}
      <CategoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="flex-1 space-y-4 overflow-y-auto px-5 pt-4 pb-6">
        {/* Month Overview Summary Card with live totals and filtered income view */}
        <MonthOverviewCard
          summary={summary}
          activeTab={activeTab}
          incomeEntriesCount={incomes.length}
          averageIncome={
            incomes.length > 0
              ? Math.round(summary.totalIncome / incomes.length)
              : 0
          }
        />

        {/* Date-Grouped Transaction Timeline with live incomes */}
        <TransactionTimeline activeTab={activeTab} />
      </div>
    </div>
  );
}

export default DashboardPage;
