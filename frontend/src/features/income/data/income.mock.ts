import type {
  IncomeRecord,
  IncomeSummary,
  IncomeSource,
  IncomeTrendPoint,
  IncomeFrequency,
} from "@/features/income/types/income.types";

/** Category → emoji mapping for visual identity in lists/cards. */
export const CATEGORY_ICONS: Record<string, string> = {
  salary: "💼",
  freelance: "💻",
  business: "🏢",
  investment: "📈",
  rental: "🏠",
  gift: "🎁",
  bonus: "🎯",
  other: "💰",
};

/** Category → human label. */
export const CATEGORY_LABELS: Record<string, string> = {
  salary: "Salary",
  freelance: "Freelance",
  business: "Business",
  investment: "Investment",
  rental: "Rental",
  gift: "Gift",
  bonus: "Bonus",
  other: "Other",
};

/** Frequency → human label. */
export const FREQUENCY_LABELS: Record<IncomeFrequency, string> = {
  MONTHLY: "Monthly",
  WEEKLY: "Weekly",
  ONE_TIME: "One-time",
  YEARLY: "Yearly",
  DAILY: "Daily",
};

export const MOCK_RECORDS: IncomeRecord[] = [
  {
    id: "inc_001",
    source: "Salary — Acme Corp",
    amount: 50000,
    frequency: "MONTHLY",
    category: "salary",
    date: "2026-08-28T00:00:00Z",
    description: "Monthly salary credited",
  },
  {
    id: "inc_002",
    source: "Freelance — UI Design",
    amount: 15000,
    frequency: "ONE_TIME",
    category: "freelance",
    date: "2026-08-22T00:00:00Z",
    description: "Landing page redesign for startup",
  },
  {
    id: "inc_003",
    source: "Performance Bonus",
    amount: 20000,
    frequency: "ONE_TIME",
    category: "bonus",
    date: "2026-08-15T00:00:00Z",
    description: "Q2 performance bonus",
  },
  {
    id: "inc_004",
    source: "Stock Dividends",
    amount: 8500,
    frequency: "YEARLY",
    category: "investment",
    date: "2026-08-10T00:00:00Z",
    description: "Annual dividend payout",
  },
  {
    id: "inc_005",
    source: "Apartment Rent",
    amount: 22000,
    frequency: "MONTHLY",
    category: "rental",
    date: "2026-08-01T00:00:00Z",
    description: "Tenant rent for flat #302",
  },
  {
    id: "inc_006",
    source: "Birthday Gift",
    amount: 5000,
    frequency: "ONE_TIME",
    category: "gift",
    date: "2026-07-28T00:00:00Z",
  },
  {
    id: "inc_007",
    source: "Salary — Acme Corp",
    amount: 50000,
    frequency: "MONTHLY",
    category: "salary",
    date: "2026-07-28T00:00:00Z",
    description: "Monthly salary credited",
  },
  {
    id: "inc_008",
    source: "Freelance — Mobile App",
    amount: 35000,
    frequency: "ONE_TIME",
    category: "freelance",
    date: "2026-07-15T00:00:00Z",
    description: "React Native app for local business",
  },
  {
    id: "inc_009",
    source: "Online Course Sales",
    amount: 12000,
    frequency: "MONTHLY",
    category: "business",
    date: "2026-07-05T00:00:00Z",
    description: "Udemy course revenue",
  },
  {
    id: "inc_010",
    source: "Apartment Rent",
    amount: 22000,
    frequency: "MONTHLY",
    category: "rental",
    date: "2026-07-01T00:00:00Z",
    description: "Tenant rent for flat #302",
  },
];

export const MOCK_SUMMARY: IncomeSummary = {
  totalIncome: 245000,
  thisMonth: 115500,
  monthlyAverage: 40833,
  totalGrowth: 12.5,
  monthGrowth: 8.2,
};

export const MOCK_SOURCES: IncomeSource[] = [
  { category: "salary", label: "Salary", amount: 100000, percentage: 41, color: "var(--chart-1)" },
  { category: "freelance", label: "Freelance", amount: 50000, percentage: 20, color: "var(--chart-2)" },
  { category: "rental", label: "Rental", amount: 44000, percentage: 18, color: "var(--chart-3)" },
  { category: "bonus", label: "Bonus", amount: 20000, percentage: 8, color: "var(--chart-4)" },
  { category: "business", label: "Business", amount: 12000, percentage: 5, color: "var(--chart-5)" },
  { category: "other", label: "Other", amount: 19000, percentage: 8, color: "var(--muted-foreground)" },
];

export const MOCK_TREND: IncomeTrendPoint[] = [
  { month: "Mar", amount: 32000 },
  { month: "Apr", amount: 38000 },
  { month: "May", amount: 42000 },
  { month: "Jun", amount: 35000 },
  { month: "Jul", amount: 52000 },
  { month: "Aug", amount: 46000 },
];
