/**
 * Public surface of the income feature. Other features should import from
 * here rather than reaching into subfolders, so internals stay free to move.
 */
export { IncomePage } from "@/features/income/pages/income-page";
export { useIncomeState } from "@/features/income/hooks/use-income-state";
export * from "@/features/income/api/income.api";
export type {
  Income,
  CreateIncomeRequest,
  UpdateIncomeRequest,
  IncomeRecord,
  IncomeSummary,
  IncomeSource,
  IncomeTrendPoint,
  IncomeFrequency,
  IncomeCategory,
} from "@/features/income/types/income.types";
