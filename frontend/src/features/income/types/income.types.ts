/**
 * Income domain types.
 * Kept in sync with the backend `income.schema` shapes.
 */

export type IncomeFrequency =
  | "ONE_TIME"
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY";

export interface Income {
  id: number;
  amount: number;
  source: string;
  frequency: IncomeFrequency;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncomeRequest {
  amount: number;
  source: string;
  frequency: IncomeFrequency;
  date: string;
}

export interface UpdateIncomeRequest {
  amount?: number;
  source?: string;
  frequency?: IncomeFrequency;
  date?: string;
}

// Keep the existing types used by the mock UI/analytics components to ensure compilation
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
