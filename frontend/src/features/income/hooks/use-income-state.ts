import { useState, useMemo, useCallback } from "react";

import type {
  IncomeRecord,
  IncomeFrequency,
  IncomeSummary,
  IncomeSource,
  IncomeTrendPoint,
} from "@/features/income/types/income.types";
import {
  MOCK_SUMMARY,
  MOCK_SOURCES,
  MOCK_TREND,
} from "@/features/income/data/income.mock";
import type { SortOption } from "@/features/income/components/income-filters";
import { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from "./useIncome";

export function useIncomeState() {
  const { data: incomes = [], isLoading, isError } = useIncomes();
  const createMutation = useCreateIncome();
  const updateMutation = useUpdateIncome();
  const deleteMutation = useDeleteIncome();

  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<IncomeFrequency | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Map backend Income models to frontend IncomeRecord models
  const records: IncomeRecord[] = useMemo(() => {
    return incomes.map((inc) => ({
      id: String(inc.id),
      source: inc.source,
      amount: Number(inc.amount) || 0,
      frequency: inc.frequency,
      category: "other", // Fallback, backend doesn't have category yet
      date: inc.date,
      description: inc.description || "",
    }));
  }, [incomes]);

  const addRecord = useCallback(
    (values: {
      source: string;
      amount: string;
      frequency: IncomeFrequency;
      category: string;
      date: string;
      description: string;
    }) => {
      createMutation.mutate({
        source: values.source,
        amount: Number(values.amount),
        frequency: values.frequency,
        date: new Date(values.date).toISOString(),
      });
    },
    [createMutation]
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
      updateMutation.mutate({
        id: Number(id),
        data: {
          source: values.source,
          amount: Number(values.amount),
          frequency: values.frequency,
          date: new Date(values.date).toISOString(),
        },
      });
    },
    [updateMutation]
  );

  const deleteRecord = useCallback(
    (id: string) => {
      deleteMutation.mutate(Number(id));
    },
    [deleteMutation]
  );

  const filteredRecords = useMemo(() => {
    let result = records;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.source.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.description?.toLowerCase().includes(q) ?? false)
      );
    }

    if (frequencyFilter !== "all") {
      result = result.filter((r) => r.frequency === frequencyFilter);
    }

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

  const summary: IncomeSummary = MOCK_SUMMARY;
  const sources: IncomeSource[] = MOCK_SOURCES;
  const trend: IncomeTrendPoint[] = MOCK_TREND;

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    records: filteredRecords,
    isLoading,
    isError,
    isPending,
    addRecord,
    updateRecord,
    deleteRecord,
    searchQuery,
    setSearchQuery,
    frequencyFilter,
    setFrequencyFilter,
    sortBy,
    setSortBy,
    summary,
    sources,
    trend,
  };
}
