import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { IncomeFrequency } from "@/features/income/types/income.types";

export type SortOption = "newest" | "oldest" | "highest" | "lowest";

interface IncomeFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  frequency: IncomeFrequency | "all";
  onFrequencyChange: (value: IncomeFrequency | "all") => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
}

/**
 * Filter bar with search, frequency dropdown, and sort dropdown.
 * Wraps to multiple rows on narrow viewports.
 */
export function IncomeFilters({
  search,
  onSearchChange,
  frequency,
  onFrequencyChange,
  sort,
  onSortChange,
}: IncomeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search income…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Frequency filter */}
      <Select
        value={frequency}
        onValueChange={(val) => onFrequencyChange(val as IncomeFrequency | "all")}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Frequency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="one-time">One-time</SelectItem>
          <SelectItem value="yearly">Yearly</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={sort}
        onValueChange={(val) => onSortChange(val as SortOption)}
      >
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
          <SelectItem value="highest">Highest first</SelectItem>
          <SelectItem value="lowest">Lowest first</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
