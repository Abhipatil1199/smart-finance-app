import type {
  Transaction,
  TransactionGroup,
  MonthSummary,
} from "@/features/dashboard/types/transaction.types";

/**
 * Mock transactions matching the Stitch design screenshot.
 * Replace with real API calls when the backend is ready.
 */
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "txn-001",
    title: "Salary",
    subtitle: "Direct deposit • 10:30 AM",
    amount: 100000,
    type: "income",
    category: "salary",
    date: "2026-08-28",
    time: "10:30 AM",
    status: "Received",
  },
  {
    id: "txn-002",
    title: "Shopping",
    subtitle: "Supermarket • Card",
    amount: 800,
    type: "expense",
    category: "shopping",
    date: "2026-08-28",
    time: "03:45 PM",
  },
  {
    id: "txn-003",
    title: "Cafe & Snacks",
    subtitle: "UPI payment • 05:12 PM",
    amount: 150,
    type: "expense",
    category: "food",
    date: "2026-08-27",
    time: "05:12 PM",
    status: "Food & Dining",
  },
  {
    id: "txn-004",
    title: "Freelance Project",
    subtitle: "Web design • Bank transfer",
    amount: 25000,
    type: "income",
    category: "freelance",
    date: "2026-08-26",
    time: "02:15 PM",
    status: "Received",
  },
  {
    id: "txn-005",
    title: "Electricity Bill",
    subtitle: "Auto-pay • UPI",
    amount: 1200,
    type: "expense",
    category: "utilities",
    date: "2026-08-26",
    time: "09:00 AM",
  },
  {
    id: "txn-006",
    title: "Uber Ride",
    subtitle: "Office commute • Card",
    amount: 350,
    type: "expense",
    category: "transport",
    date: "2026-08-25",
    time: "08:30 AM",
  },
  {
    id: "txn-007",
    title: "Investment Returns",
    subtitle: "Mutual fund • HDFC",
    amount: 5000,
    type: "income",
    category: "investment",
    date: "2026-08-25",
    time: "11:00 AM",
    status: "Credited",
  },
];

/** Format a number as Indian currency (₹1,00,000). */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Group transactions by date, sorted newest first. */
export function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionGroup[] {
  const grouped = new Map<string, Transaction[]>();

  for (const txn of transactions) {
    const existing = grouped.get(txn.date);
    if (existing) {
      existing.push(txn);
    } else {
      grouped.set(txn.date, [txn]);
    }
  }

  const groups: TransactionGroup[] = [];

  for (const [date, txns] of grouped) {
    const d = new Date(date + "T00:00:00");
    const dayName = d.toLocaleDateString("en-IN", { weekday: "long" });
    const dateLabel = d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });

    const totalIncome = txns
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = txns
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    groups.push({
      date,
      dayName,
      dateLabel,
      totalIncome,
      totalExpenses,
      transactions: txns,
    });
  }

  // Sort newest first
  groups.sort((a, b) => b.date.localeCompare(a.date));
  return groups;
}

/** Mock month summary matching the design. */
export const MOCK_MONTH_SUMMARY: MonthSummary = {
  month: "Aug",
  year: 2026,
  netBalance: 99200,
  totalIncome: 100000,
  totalExpenses: 800,
  trendPercentage: 12.4,
  balanceStatus: "surplus",
};

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeTransactions(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addMockTransaction(txn: Transaction): void {
  MOCK_TRANSACTIONS.unshift(txn);
  if (txn.type === "expense") {
    MOCK_MONTH_SUMMARY.totalExpenses += txn.amount;
    MOCK_MONTH_SUMMARY.netBalance -= txn.amount;
  } else if (txn.type === "income") {
    MOCK_MONTH_SUMMARY.totalIncome += txn.amount;
    MOCK_MONTH_SUMMARY.netBalance += txn.amount;
  }
  listeners.forEach((l) => l());
}

export function deleteMockTransaction(id: string): void {
  const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
  if (index !== -1) {
    const [removed] = MOCK_TRANSACTIONS.splice(index, 1);
    if (removed.type === "expense") {
      MOCK_MONTH_SUMMARY.totalExpenses -= removed.amount;
      MOCK_MONTH_SUMMARY.netBalance += removed.amount;
    } else if (removed.type === "income") {
      MOCK_MONTH_SUMMARY.totalIncome -= removed.amount;
      MOCK_MONTH_SUMMARY.netBalance -= removed.amount;
    }
    listeners.forEach((l) => l());
  }
}

export function updateMockTransaction(
  id: string,
  updated: Partial<Transaction>
): void {
  const txn = MOCK_TRANSACTIONS.find((t) => t.id === id);
  if (txn) {
    const oldAmount = txn.amount;
    Object.assign(txn, updated);
    if (updated.amount !== undefined && updated.amount !== oldAmount) {
      const diff = updated.amount - oldAmount;
      if (txn.type === "expense") {
        MOCK_MONTH_SUMMARY.totalExpenses += diff;
        MOCK_MONTH_SUMMARY.netBalance -= diff;
      } else if (txn.type === "income") {
        MOCK_MONTH_SUMMARY.totalIncome += diff;
        MOCK_MONTH_SUMMARY.netBalance += diff;
      }
    }
    listeners.forEach((l) => l());
  }
}


