import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { IncomeRecord, IncomeFrequency, IncomeCategory } from "@/features/income/types/income.types";

interface IncomeFormValues {
  source: string;
  amount: string;
  frequency: IncomeFrequency;
  category: IncomeCategory;
  date: string;
  description: string;
}

interface IncomeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass a record to edit; `undefined` means "add new". */
  editRecord?: IncomeRecord;
  onSubmit: (values: IncomeFormValues) => void;
}

/**
 * Add / Edit income dialog.
 * Bottom sheet on mobile, centered modal on desktop.
 * Uses react-hook-form for controlled inputs with validation.
 */
export function IncomeFormDialog({
  open,
  onOpenChange,
  editRecord,
  onSubmit,
}: IncomeFormDialogProps) {
  const isEdit = !!editRecord;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IncomeFormValues>({
    defaultValues: {
      source: "",
      amount: "",
      frequency: "monthly",
      category: "salary",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  // Reset form when the dialog opens with a different record
  useEffect(() => {
    if (open) {
      if (editRecord) {
        reset({
          source: editRecord.source,
          amount: String(editRecord.amount),
          frequency: editRecord.frequency,
          category: editRecord.category,
          date: editRecord.date.split("T")[0],
          description: editRecord.description ?? "",
        });
      } else {
        reset({
          source: "",
          amount: "",
          frequency: "monthly",
          category: "salary",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      }
    }
  }, [open, editRecord, reset]);

  const frequencyValue = watch("frequency");
  const categoryValue = watch("category");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Income" : "Add Income"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this income entry."
              : "Record a new source of income."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => {
            onSubmit(values);
            onOpenChange(false);
          })}
        >
          <DialogBody className="flex flex-col gap-5">
            {/* Source */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="income-source">Source *</Label>
              <Input
                id="income-source"
                placeholder="e.g. Salary — Acme Corp"
                {...register("source", { required: "Source is required" })}
                aria-invalid={errors.source ? "true" : undefined}
              />
              {errors.source ? (
                <span className="text-xs text-destructive">{errors.source.message}</span>
              ) : null}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="income-amount">Amount (₹) *</Label>
              <Input
                id="income-amount"
                type="number"
                min="1"
                placeholder="50000"
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 1, message: "Amount must be positive" },
                })}
                aria-invalid={errors.amount ? "true" : undefined}
              />
              {errors.amount ? (
                <span className="text-xs text-destructive">{errors.amount.message}</span>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Frequency */}
              <div className="flex flex-col gap-1.5">
                <Label>Frequency</Label>
                <Select
                  value={frequencyValue}
                  onValueChange={(val) => setValue("frequency", val as IncomeFrequency)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select
                  value={categoryValue}
                  onValueChange={(val) => setValue("category", val as IncomeCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salary">💼 Salary</SelectItem>
                    <SelectItem value="freelance">💻 Freelance</SelectItem>
                    <SelectItem value="business">🏢 Business</SelectItem>
                    <SelectItem value="investment">📈 Investment</SelectItem>
                    <SelectItem value="rental">🏠 Rental</SelectItem>
                    <SelectItem value="gift">🎁 Gift</SelectItem>
                    <SelectItem value="bonus">🎯 Bonus</SelectItem>
                    <SelectItem value="other">💰 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="income-date">Date *</Label>
              <Input
                id="income-date"
                type="date"
                {...register("date", { required: "Date is required" })}
                aria-invalid={errors.date ? "true" : undefined}
              />
              {errors.date ? (
                <span className="text-xs text-destructive">{errors.date.message}</span>
              ) : null}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="income-description">
                Description <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="income-description"
                placeholder="Brief note about this income"
                {...register("description")}
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="xl">
              {isEdit ? "Save Changes" : "Add Income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
