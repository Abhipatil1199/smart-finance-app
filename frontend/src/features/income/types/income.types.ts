/**
 * Income domain types.
 * Kept in sync with the backend `income.schema` shapes; the API layer will
 * eventually map server responses into these, but for now mock data uses them
 * directly.
 */

export type IncomeFrequency = "monthly" | "weekly" | "one-time" | "yearly";

export type IncomeCategory =
  | "salary"
  | "freelance"
  | "business"
  | "investment"
  | "rental"
  | "gift"
  | "bonus"
  | "other";

export interface IncomeRecord {
  id: string;
  source: string;
  amount: number;
  frequency: IncomeFrequency;
  category: IncomeCategory;
  date: string; // ISO 8601
  description?: string;
}

export interface IncomeSummary {
  totalIncome: number;
  thisMonth: number;
  monthlyAverage: number;
  /** Year-over-year growth percentage. */
  totalGrowth: number;
  /** Month-over-month growth percentage. */
  monthGrowth: number;
}

export interface IncomeSource {
  category: IncomeCategory;
  label: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface IncomeTrendPoint {
  month: string;
  amount: number;
}
