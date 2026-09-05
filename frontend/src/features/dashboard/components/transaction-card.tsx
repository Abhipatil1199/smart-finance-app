import { useState, useRef, useEffect } from "react";
import {
  BriefcaseIcon,
  ShoppingCartIcon,
  CoffeeIcon,
  ZapIcon,
  CarIcon,
  TrendingUpIcon,
  GiftIcon,
  HomeIcon,
  BookOpenIcon,
  HeartIcon,
  ArrowLeftRightIcon,
  CircleDotIcon,
  BanknoteIcon,
  LightbulbIcon,
  GamepadIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  Transaction,
  TransactionCategory,
} from "@/features/dashboard/types/transaction.types";
import { formatINR } from "@/features/dashboard/data/mock-transactions";

interface TransactionCardProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

/** Colour + icon config per transaction category. */
const CATEGORY_STYLES: Record<
  TransactionCategory,
  {
    bg: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  salary: {
    bg: "bg-amber-100 dark:bg-amber-900/40",
    text: "text-amber-600 dark:text-amber-400",
    icon: BriefcaseIcon,
  },
  freelance: {
    bg: "bg-blue-100 dark:bg-blue-900/40",
    text: "text-blue-600 dark:text-blue-400",
    icon: BanknoteIcon,
  },
  business: {
    bg: "bg-violet-100 dark:bg-violet-900/40",
    text: "text-violet-600 dark:text-violet-400",
    icon: TrendingUpIcon,
  },
  investment: {
    bg: "bg-emerald-100 dark:bg-emerald-900/40",
    text: "text-emerald-600 dark:text-emerald-400",
    icon: TrendingUpIcon,
  },
  rental: {
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-600 dark:text-orange-400",
    icon: HomeIcon,
  },
  gift: {
    bg: "bg-pink-100 dark:bg-pink-900/40",
    text: "text-pink-600 dark:text-pink-400",
    icon: GiftIcon,
  },
  bonus: {
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    text: "text-yellow-600 dark:text-yellow-400",
    icon: ZapIcon,
  },
  shopping: {
    bg: "bg-amber-500 dark:bg-amber-600",
    text: "text-white",
    icon: ShoppingCartIcon,
  },
  food: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    icon: CoffeeIcon,
  },
  transport: {
    bg: "bg-sky-100 dark:bg-sky-900/40",
    text: "text-sky-600 dark:text-sky-400",
    icon: CarIcon,
  },
  utilities: {
    bg: "bg-orange-100 dark:bg-orange-900/40",
    text: "text-orange-600 dark:text-orange-400",
    icon: LightbulbIcon,
  },
  entertainment: {
    bg: "bg-purple-100 dark:bg-purple-900/40",
    text: "text-purple-600 dark:text-purple-400",
    icon: GamepadIcon,
  },
  health: {
    bg: "bg-red-100 dark:bg-red-900/40",
    text: "text-red-600 dark:text-red-400",
    icon: HeartIcon,
  },
  education: {
    bg: "bg-indigo-100 dark:bg-indigo-900/40",
    text: "text-indigo-600 dark:text-indigo-400",
    icon: BookOpenIcon,
  },
  transfer: {
    bg: "bg-slate-100 dark:bg-slate-700",
    text: "text-slate-600 dark:text-slate-300",
    icon: ArrowLeftRightIcon,
  },
  other: {
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-600 dark:text-gray-300",
    icon: CircleDotIcon,
  },
};

/**
 * Individual transaction row card with a category icon,
 * title/subtitle, amount, status badge, and 3-dots action menu for Edit & Delete.
 * Matches Stitch "Home Filtered Income View" design.
 */
export function TransactionCard({
  transaction,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = CATEGORY_STYLES[transaction.category] ?? CATEGORY_STYLES.other;
  const Icon = style.icon;
  const isIncome = transaction.type === "income";

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <article
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-2xl border bg-card p-3.5 shadow-xs transition",
        "border-border/80 hover:shadow-md",
        isIncome
          ? "hover:border-emerald-200 dark:hover:border-emerald-800"
          : "hover:border-amber-200 dark:hover:border-amber-800",
      )}
    >
      <div className="flex items-center space-x-3.5 min-w-0 pr-2">
        {/* Category icon */}
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-xs",
            style.bg,
            style.text,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold leading-snug text-foreground truncate">
            {transaction.title}
          </h2>
          <p className="text-xs text-muted-foreground truncate">
            {transaction.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <div className="text-right">
          <span
            className={cn(
              "block text-base font-extrabold tracking-tight",
              isIncome
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground",
            )}
          >
            {isIncome ? "+" : "-"}
            {formatINR(transaction.amount)}
          </span>
          {/* {transaction.status && (
            <span
              className={cn(
                "inline-block text-[10px] font-medium",
                isIncome
                  ? "rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {transaction.status}
            </span>
          )} */}
          {/* {!transaction.status && (
            <span className="block text-[10px] font-medium text-muted-foreground">
              {transaction.time}
            </span>
          )} */}
        </div>

        {/* ── 3-Dots Action Menu ───────────────────────────────────────── */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition focus:outline-none active:scale-95"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {/* Popup Dropdown Menu matching Stitch UI */}
          {menuOpen && (
            <div
              className="absolute right-0 top-8 z-30 w-36 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-1 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit?.(transaction);
                }}
                className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <PencilIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete?.(transaction);
                }}
                className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              >
                <Trash2Icon className="h-3.5 w-3.5 text-rose-500" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default TransactionCard;
