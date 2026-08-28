import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IncomeRecord } from "@/features/income/types/income.types";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: IncomeRecord | null;
  onConfirm: () => void;
}

/**
 * Destructive confirmation dialog for deleting an income record.
 * Shows the record name so the user knows exactly what they're deleting.
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  record,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose={false}>
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-6 text-destructive" />
          </div>
          <DialogTitle>Delete Income</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{record?.source ?? "this record"}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogBody />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="xl"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
