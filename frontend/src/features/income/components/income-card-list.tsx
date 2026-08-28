import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { IncomeRecord } from "@/features/income/types/income.types";
import { CATEGORY_ICONS, FREQUENCY_LABELS } from "@/features/income/data/income.mock";

interface IncomeCardListProps {
  records: IncomeRecord[];
  onEdit: (record: IncomeRecord) => void;
  onDelete: (record: IncomeRecord) => void;
}

/** Formats a number as ₹X,XX,XXX (Indian numbering). */
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Mobile income records as stacked cards. Visible only on mobile (`md:hidden`).
 * Touch-friendly with 44px action targets.
 */
export function IncomeCardList({ records, onEdit, onDelete }: IncomeCardListProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border py-16 text-center md:hidden">
        <p className="text-sm text-muted-foreground">No income records found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 md:hidden">
      {records.map((record, index) => (
        <div
          key={record.id}
          className="group rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/[0.06] transition-all duration-200 hover:shadow-sm active:scale-[0.99]"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left: icon + info */}
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-lg">
                {CATEGORY_ICONS[record.category] ?? "💰"}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-medium leading-tight">{record.source}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[0.625rem]">
                    {FREQUENCY_LABELS[record.frequency] ?? record.frequency}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(record.date)}</span>
                </div>
              </div>
            </div>

            {/* Right: amount + actions */}
            <div className="flex items-center gap-1">
              <span className="font-heading text-base font-bold tabular-nums">
                {formatINR(record.amount)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                      aria-label="Actions"
                    />
                  }
                >
                  <MoreVerticalIcon className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(record)}>
                    <PencilIcon /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(record)}
                  >
                    <Trash2Icon /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Description (if present) */}
          {record.description ? (
            <p className="mt-2 pl-[3.25rem] text-xs text-muted-foreground line-clamp-2">
              {record.description}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
