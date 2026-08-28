import { useState, useMemo, useCallback } from "react";

import type {
  IncomeRecord,
  IncomeFrequency,
  IncomeSummary,
  IncomeSource,
  IncomeTrendPoint,
} from "@/features/income/types/income.types";
import {
  MOCK_RECORDS,
  MOCK_SUMMARY,
  MOCK_SOURCES,
  MOCK_TREND,
} from "@/features/income/data/income.mock";
import type { SortOption } from "@/features/income/components/income-filters";

/**
 * Local state hook for the income page. Manages CRUD operations on mock data
 * and provides computed values for filtering, sorting, and analytics.
 *
 * When the API layer is ready, replace this with React Query mutations.
 */
export function useIncomeState() {
  const [records, setRecords] = useState<IncomeRecord[]>(MOCK_RECORDS);
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<IncomeFrequency | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  /* ── CRUD ──────────────────────────────────────────────────────────── */

  const addRecord = useCallback(
    (values: {
      source: string;
      amount: string;
      frequency: IncomeFrequency;
      category: string;
      date: string;
      description: string;
    }) => {
      const newRecord: IncomeRecord = {
        id: `inc_${Date.now()}`,
        source: values.source,
        amount: Number(values.amount),
        frequency: values.frequency,
        category: values.category as IncomeRecord["category"],
        date: new Date(values.date).toISOString(),
        description: values.description || undefined,
      };
      setRecords((prev) => [newRecord, ...prev]);
    },
    []
  );

  const updateRecord = useCallback(
    (
      id: string,
      values: {
        source: string;
        amount: string;
        frequency: IncomeFrequency;
        category: string;
        date: string;
        description: string;
      }
    ) => {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                source: values.source,
                amount: Number(values.amount),
                frequency: values.frequency,
                category: values.category as IncomeRecord["category"],
                date: new Date(values.date).toISOString(),
                description: values.description || undefined,
              }
            : r
        )
      );
    },
    []
  );

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /* ── Filtered + sorted records ─────────────────────────────────────── */

  const filteredRecords = useMemo(() => {
    let result = records;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.source.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false)
      );
    }

    // Frequency filter
    if (frequencyFilter !== "all") {
      result = result.filter((r) => r.frequency === frequencyFilter);
    }

    // Sort
    const sorted = [...result];
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "highest":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        sorted.sort((a, b) => a.amount - b.amount);
        break;
    }

    return sorted;
  }, [records, searchQuery, frequencyFilter, sortBy]);

  /* ── Analytics (static mock for now) ──────────────────────────────── */

  const summary: IncomeSummary = MOCK_SUMMARY;
  const sources: IncomeSource[] = MOCK_SOURCES;
  const trend: IncomeTrendPoint[] = MOCK_TREND;

  return {
    // Records
    records: filteredRecords,
    addRecord,
    updateRecord,
    deleteRecord,

    // Filters
    searchQuery,
    setSearchQuery,
    frequencyFilter,
    setFrequencyFilter,
    sortBy,
    setSortBy,

    // Analytics
    summary,
    sources,
    trend,
  };
}
