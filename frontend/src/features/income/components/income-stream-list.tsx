import {
  ChevronRightIcon,
  BuildingIcon,
  BrushIcon,
  HomeIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { IncomeRecord } from "@/features/income/types/income.types";
import { FREQUENCY_LABELS } from "@/features/income/data/income.mock";

interface IncomeStreamListProps {
  records: IncomeRecord[];
  onEdit: (record: IncomeRecord) => void;
  onDelete: (record: IncomeRecord) => void;
  onViewAll?: () => void;
}

/** Formats a number as ₹X,XX,XXX.XX (Indian numbering). */
function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

/** Map income categories to border colors using CSS variables. */
const CATEGORY_BORDER_COLORS: Record<string, string> = {
  salary: "border-l-success",
  freelance: "border-l-chart-2",
  business: "border-l-chart-5",
  investment: "border-l-chart-4",
  rental: "border-l-chart-3",
  gift: "border-l-warning",
  bonus: "border-l-chart-4",
  other: "border-l-muted-foreground",
};

/** Map income categories to icons. */
function getCategoryIcon(category: string) {
  switch (category) {
    case "salary":
      return <BuildingIcon className="size-5 text-muted-foreground" />;
    case "freelance":
      return <BrushIcon className="size-5 text-muted-foreground" />;
    case "rental":
      return <HomeIcon className="size-5 text-muted-foreground" />;
    default:
      return <BuildingIcon className="size-5 text-muted-foreground" />;
  }
}

/**
 * Income Streams — stacked list cards with colored left borders.
 * Matches the Stitch design with icon circles, source names, and amounts.
 * Shows at most 5 items; "View All" reveals the full list.
 */
export function IncomeStreamList({
  records,
  onEdit,
  onDelete,
}: IncomeStreamListProps) {
  // Deduplicate by source name and take top items by amount
  const uniqueStreams = records.reduce<IncomeRecord[]>((acc, record) => {
    if (!acc.find((r) => r.source === record.source)) {
      acc.push(record);
    }
    return acc;
  }, []);

  const displayStreams = uniqueStreams.slice(0, 5);

  if (displayStreams.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No income streams yet. Add your first income!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {displayStreams.map((record) => {
        const borderColor =
          CATEGORY_BORDER_COLORS[record.category] ?? "border-l-muted-foreground";

        return (
          <div
            key={record.id}
            className={`bento-card-static flex items-center justify-between border-l-4 p-4 ${borderColor} cursor-pointer`}
          >
            <div className="flex items-center gap-3">
              {/* Icon circle */}
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted">
                {getCategoryIcon(record.category)}
              </div>
              {/* Source info */}
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  {record.source}
                </h4>
                <p className="text-[0.75rem] text-muted-foreground">
                  {FREQUENCY_LABELS[record.frequency] ?? record.frequency}
                  {record.description ? ` • ${record.description}` : ""}
                </p>
              </div>
            </div>

            {/* Right side: amount + actions */}
            <div className="flex items-center gap-1">
              <span className="font-heading text-sm font-bold tabular-nums text-foreground">
                {formatINR(record.amount)}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground"
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

              <ChevronRightIcon className="size-5 text-muted-foreground" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
