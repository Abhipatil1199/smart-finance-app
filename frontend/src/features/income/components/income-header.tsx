import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface IncomeHeaderProps {
  onAddClick: () => void;
}

/**
 * Page header with title, subtitle and the "Add Income" CTA.
 * Stacked on mobile, flex row on larger screens.
 */
export function IncomeHeader({ onAddClick }: IncomeHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Income
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your income
        </p>
      </div>
      <Button
        type="button"
        size="xl"
        onClick={onAddClick}
        className="mt-3 w-full sm:mt-0 sm:w-auto"
      >
        <PlusIcon className="size-4" data-icon="inline-start" />
        Add Income
      </Button>
    </div>
  );
}
