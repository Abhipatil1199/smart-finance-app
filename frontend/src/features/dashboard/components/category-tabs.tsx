import { cn } from "@/lib/utils";
import type { TransactionType } from "@/features/dashboard/types/transaction.types";

export type TabFilter = "overview" | "income" | "expense" | "transfer";

interface CategoryTabsProps {
  activeTab: TabFilter;
  onTabChange: (tab: TabFilter) => void;
}

const TABS: { id: TabFilter; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expenses" },
  { id: "transfer", label: "Transfers" },
];

/**
 * Horizontal sliding category tabs with an animated emerald underline
 * on the active tab. Matches the Stitch design's filter chip bar.
 */
export function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <nav
      aria-label="Category Tabs"
      className="no-scrollbar sticky top-0 z-20 flex items-center gap-7 overflow-x-auto border-b border-border bg-background px-5 select-none"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative shrink-0 py-3 text-sm font-medium transition-colors",
              isActive
                ? "font-bold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

/** Map a TabFilter to the corresponding TransactionType for filtering. */
export function getFilterType(tab: TabFilter): TransactionType | null {
  switch (tab) {
    case "income":
      return "income";
    case "expense":
      return "expense";
    case "transfer":
      return "transfer";
    default:
      return null; // overview = show all
  }
}
