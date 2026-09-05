import type { LucideIcon } from "lucide-react";
import type { IncomeCategory, IncomeFrequency } from "@/features/income/types/income.types";

export type TransactionTypeTab = "expense" | "income" | "transfer";

export interface TransactionCategoryItem {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Tailwind background color classes for the icon container */
  bgClass: string;
  /** Tailwind text color classes for the icon */
  textClass: string;
  type: TransactionTypeTab;
  /** Maps to existing backend IncomeCategory if it's an income type */
  incomeCategory?: IncomeCategory;
}

export interface NewTransactionPayload {
  type: TransactionTypeTab;
  category: string;
  amount: number;
  date: string;
  frequency?: IncomeFrequency;
  account?: string;
  description?: string;
  /** Local transaction id — present when editing an existing transaction */
  editId?: string;
  /** Backend numeric id — present when editing a real income record */
  rawId?: number;
}
