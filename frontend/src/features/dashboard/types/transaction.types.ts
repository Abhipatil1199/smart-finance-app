/**
 * Transaction domain types for the dashboard home screen.
 * Structured to mirror future API response shapes.
 */

export type TransactionType = "income" | "expense" | "transfer";

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "business"
  | "investment"
  | "rental"
  | "gift"
  | "bonus"
  | "shopping"
  | "food"
  | "transport"
  | "utilities"
  | "entertainment"
  | "health"
  | "education"
  | "transfer"
  | "other";

export interface Transaction {
  id: string;
  /** Numeric ID from backend API if from real database */
  rawId?: number;
  title: string;
  /** Short description, e.g. "Direct deposit", "Supermarket • Card" */
  subtitle: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  /** ISO 8601 date string (YYYY-MM-DD) */
  date: string;
  /** e.g. "10:30 AM" */
  time: string;
  /** Optional status label like "Received", "Pending" */
  status?: string;
  /** Income frequency like "MONTHLY" */
  frequency?: string;
  /** Custom notes or description */
  description?: string;
}

export interface TransactionGroup {
  /** ISO date (YYYY-MM-DD) */
  date: string;
  /** e.g. "Friday" */
  dayName: string;
  /** e.g. "Aug 28" */
  dateLabel: string;
  totalExpenses: number;
  totalIncome: number;
  transactions: Transaction[];
}

export interface MonthSummary {
  month: string;
  year: number;
  netBalance: number;
  totalIncome: number;
  totalExpenses: number;
  /** e.g. +12.4 */
  trendPercentage: number;
  /** "surplus" or "deficit" */
  balanceStatus: "surplus" | "deficit";
}
