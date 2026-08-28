import { useState } from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { IncomeHeader } from "@/features/income/components/income-header";
import { IncomeSummary } from "@/features/income/components/income-summary";
import { IncomeTrendChart } from "@/features/income/components/income-trend-chart";
import { IncomeSources } from "@/features/income/components/income-sources";
import { IncomeFilters } from "@/features/income/components/income-filters";
import { IncomeCardList } from "@/features/income/components/income-card-list";
import { IncomeFormDialog } from "@/features/income/components/income-form-dialog";
import { DeleteConfirmDialog } from "@/features/income/components/delete-confirm-dialog";
import { useIncomeState } from "@/features/income/hooks/use-income-state";
import type { IncomeRecord } from "@/features/income/types/income.types";

/**
 * Income page — the main entry point for the income module.
 * Assembles all income components into a responsive dashboard layout.
 */
export function IncomePage() {
  const {
    records,
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
  } = useIncomeState();

  /* ── Dialog state ──────────────────────────────────────────────────── */

  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IncomeRecord | undefined>();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IncomeRecord | null>(null);

  const handleAddClick = () => {
    setEditRecord(undefined);
    setFormOpen(true);
  };

  const handleEdit = (record: IncomeRecord) => {
    setEditRecord(record);
    setFormOpen(true);
  };

  const handleDelete = (record: IncomeRecord) => {
    setDeleteTarget(record);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (values: {
    source: string;
    amount: string;
    frequency: string;
    category: string;
    date: string;
    description: string;
  }) => {
    if (editRecord) {
      updateRecord(editRecord.id, values as Parameters<typeof updateRecord>[1]);
    } else {
      addRecord(values as Parameters<typeof addRecord>[0]);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteRecord(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 p-5">
      {/* Page header */}
      <IncomeHeader onAddClick={handleAddClick} />

        {/* Summary cards */}
        <IncomeSummary summary={summary} />

        {/* Analytics charts */}
        <div className="flex flex-col gap-6">
          <IncomeTrendChart data={trend} />
          <IncomeSources sources={sources} />
        </div>

        {/* Income history */}
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Income History
          </h2>

          <IncomeFilters
            search={searchQuery}
            onSearchChange={setSearchQuery}
            frequency={frequencyFilter}
            onFrequencyChange={setFrequencyFilter}
            sort={sortBy}
            onSortChange={setSortBy}
          />

          {/* Mobile-only cards view */}
          <IncomeCardList
            records={records}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <IncomeFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          editRecord={editRecord}
          onSubmit={handleFormSubmit}
        />
        <DeleteConfirmDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          record={deleteTarget}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    );
}

export default IncomePage;
