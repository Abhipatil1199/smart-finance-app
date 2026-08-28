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

interface IncomeTableProps {
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
 * Desktop income records table. Hidden on mobile (`hidden md:block`).
 * Clean rows with hover highlighting and inline action menu.
 */
export function IncomeTable({ records, onEdit, onDelete }: IncomeTableProps) {
  if (records.length === 0) {
    return (
      <div className="hidden rounded-xl border border-dashed border-border py-16 text-center md:block">
        <p className="text-sm text-muted-foreground">No income records found.</p>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-xl border border-border md:block">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Source</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Frequency</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
            <th className="w-12 px-4 py-3 text-right font-medium text-muted-foreground">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr
              key={record.id}
              className="group border-b border-border last:border-b-0 transition-colors hover:bg-muted/30"
            >
              {/* Source */}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-base">
                    {CATEGORY_ICONS[record.category] ?? "💰"}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium leading-tight">{record.source}</span>
                    {record.description ? (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {record.description}
                      </span>
                    ) : null}
                  </div>
                </div>
              </td>

              {/* Amount */}
              <td className="px-4 py-3 font-semibold tabular-nums">
                {formatINR(record.amount)}
              </td>

              {/* Frequency */}
              <td className="px-4 py-3">
                <Badge variant="outline">
                  {FREQUENCY_LABELS[record.frequency] ?? record.frequency}
                </Badge>
              </td>

              {/* Date */}
              <td className="px-4 py-3 text-muted-foreground">{formatDate(record.date)}</td>

              {/* Actions */}
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
