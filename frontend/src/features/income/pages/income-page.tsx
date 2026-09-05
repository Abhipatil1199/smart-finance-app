import { useState } from "react";

import { BentoTotalIncome } from "@/features/income/components/bento-total-income";
import { BentoThisMonth } from "@/features/income/components/bento-this-month";
import { BentoProjected } from "@/features/income/components/bento-projected";
import { BentoTopSource } from "@/features/income/components/bento-top-source";
import { BentoSavingsRate } from "@/features/income/components/bento-savings-rate";
import { IncomeStreamList } from "@/features/income/components/income-stream-list";
import { IncomeFilters } from "@/features/income/components/income-filters";
import { IncomeCardList } from "@/features/income/components/income-card-list";
import { IncomeFormDialog } from "@/features/income/components/income-form-dialog";
import { DeleteConfirmDialog } from "@/features/income/components/delete-confirm-dialog";
import { useIncomeState } from "@/features/income/hooks/use-income-state";
import type { IncomeRecord } from "@/features/income/types/income.types";
import { Spinner } from "@/components/ui/spinner";

/**
 * Income page — bento dashboard layout matching the Stitch design.
 * Assembles bento cards into a responsive grid, then shows income streams
 * and a full history list below.
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
    isLoading,
  } = useIncomeState();

  /* ── Dialog state ──────────────────────────────────────────────────── */

  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<IncomeRecord | undefined>();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IncomeRecord | null>(null);


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

  /* ── FAB Handler handled globally by Stitch modal ─────────────────── */

  /* ── Render ────────────────────────────────────────────────────────── */

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 px-5 py-6">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Income Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and analyze your revenue streams.
        </p>
      </div>

      {/* ── Bento Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Full-width: Total Income (YTD) */}
        <BentoTotalIncome summary={summary} trend={trend} />

        {/* Half-width: This Month */}
        <BentoThisMonth summary={summary} />

        {/* Half-width: Projected */}
        <BentoProjected records={records} />

        {/* Small: Top Source */}
        <BentoTopSource sources={sources} />

        {/* Small: Savings Rate */}
        <BentoSavingsRate summary={summary} />
      </div>

      {/* ── Income Streams ────────────────────────────────────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Income Streams
          </h2>
          <button
            type="button"
            className="text-xs font-semibold text-primary hover:underline"
          >
            View All
          </button>
        </div>
        <IncomeStreamList
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Income History ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
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

        <IncomeCardList
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Dialogs ───────────────────────────────────────────────────── */}
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
