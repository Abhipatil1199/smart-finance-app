import { Trash2Icon, Loader2Icon } from "lucide-react";
import type { Transaction } from "@/features/dashboard/types/transaction.types";
import { formatINR } from "@/features/dashboard/data/mock-transactions";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  transaction,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => !isDeleting && onClose()}
      />

      {/* Dialog card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mb-4 shadow-xs">
          <Trash2Icon className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-foreground">
          Delete {transaction.type === "income" ? "Income" : "Transaction"}?
        </h3>

        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <strong className="font-semibold text-foreground">
            {transaction.title}
          </strong>{" "}
          ({formatINR(transaction.amount)})? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-5 flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-1/2 rounded-xl border border-border bg-muted/70 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted transition active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-1/2 inline-flex items-center justify-center space-x-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-rose-500 active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2Icon className="h-3.5 w-3.5" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmDialog;
