import { createContext, useCallback, useContext, useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { MenuIcon, SearchIcon, CalendarIcon } from "lucide-react";

import { BottomNav } from "@/components/navigation/bottom-nav";
import { CashbookMenu } from "@/components/navigation/cashbook-menu";
import { Button } from "@/components/ui/button";
import { SelectCategoryModal } from "@/features/transactions/components/select-category-modal";
import type { NewTransactionPayload } from "@/features/transactions/types/category.types";
import {
  useCreateIncome,
  useUpdateIncome,
} from "@/features/income/hooks/useIncome";
import {
  addMockTransaction,
  updateMockTransaction,
} from "@/features/dashboard/data/mock-transactions";
import type { Transaction } from "@/features/dashboard/types/transaction.types";

/**
 * Context that lets any child page register a callback for the FAB (+) button,
 * and also trigger the global edit-transaction modal.
 */
interface FabContextValue {
  registerFabHandler: (handler: (() => void) | null) => void;
  openEditTransaction: (txn: Transaction) => void;
}

const FabContext = createContext<FabContextValue>({
  registerFabHandler: () => {},
  openEditTransaction: () => {},
});

/** Hook for pages to register a custom FAB click handler or trigger edit. */
export function useFabRegistration() {
  return useContext(FabContext);
}

/**
 * Main layout for authenticated pages.
 * Enforces a mobile-only UI by setting a max-w-md width and centering.
 * Manages the global SelectCategoryModal (used for both Add and Edit).
 */
export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [fabHandler, setFabHandler] = useState<(() => void) | null>(null);
  const isSubmittingRef = useRef(false);

  const createIncomeMutation = useCreateIncome();
  const updateIncomeMutation = useUpdateIncome();

  const registerFabHandler = useCallback((handler: (() => void) | null) => {
    setFabHandler(() => handler);
  }, []);

  const openEditTransaction = useCallback((txn: Transaction) => {
    setEditTransaction(txn);
    setIsAddModalOpen(true);
  }, []);

  const handleFabClick = () => {
    if (fabHandler) {
      fabHandler();
    } else {
      setEditTransaction(null);
      setIsAddModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditTransaction(null);
  };

  const handleTransactionSubmit = async (payload: NewTransactionPayload) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      const timeNow = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const isEdit = !!(payload.editId || payload.rawId);

      if (payload.type === "income") {
        if (isEdit && payload.rawId) {
          // ── UPDATE existing income via PUT /api/incomes/:id ──────────
          await updateIncomeMutation.mutateAsync({
            id: payload.rawId,
            data: {
              source: payload.category,
              amount: payload.amount,
              frequency: payload.frequency || "MONTHLY",
              date: new Date(payload.date).toISOString(),
              description: payload.description,
            },
          });
        } else {
          // ── CREATE new income via POST /api/incomes ──────────────────
          await createIncomeMutation.mutateAsync({
            source: payload.category,
            amount: payload.amount,
            frequency: payload.frequency || "MONTHLY",
            date: new Date(payload.date).toISOString(),
            description: payload.description,
          });
        }
      } else {
        // Expense or Transfer — local mock only (no backend yet)
        if (isEdit && payload.editId) {
          updateMockTransaction(payload.editId, {
            title: payload.category,
            amount: payload.amount,
            date: payload.date,
            description: payload.description,
          });
        } else {
          addMockTransaction({
            id: `txn-${Date.now()}`,
            title: payload.category,
            subtitle: payload.description
              ? `${payload.description} • ${payload.account || "Card"}`
              : `${payload.account || "Card"} payment • ${timeNow}`,
            amount: payload.amount,
            type: payload.type === "transfer" ? "transfer" : "expense",
            category:
              (payload.category.toLowerCase().replace(/[^a-z]/g, "") as any) ||
              "other",
            date: payload.date,
            time: timeNow,
            status: payload.account || "Paid",
          });
        }
      }

      handleModalClose();
    } catch (err) {
      console.error("Failed to submit transaction:", err);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const isSubmitting =
    createIncomeMutation.isPending || updateIncomeMutation.isPending;

  return (
    <FabContext.Provider value={{ registerFabHandler, openEditTransaction }}>
      <div className="flex min-h-screen bg-muted/20">
        {/* 
          This wrapper is the "mobile frame".
          It restricts width on desktop to mimic a phone, and takes full width on mobile.
        */}
        <div className="mx-auto flex w-full max-w-md flex-col bg-background pb-safe shadow-sm ring-1 ring-border/50">
          {/* Global Mobile Header matching Stitch UI */}
          <header className="sticky top-2 z-30 flex items-center justify-between border-b border-border/80 bg-background/95 px-5 py-3 pt-safe backdrop-blur-md">
            {/* Left: Hamburger menu button + Title & Sync status */}
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="-ml-2 rounded-xl text-foreground/80 hover:bg-muted active:scale-95 transition-all"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <MenuIcon className="size-6" />
              </Button>

              <div>
                <h1 className="text-lg font-bold leading-tight tracking-tight text-foreground">
                  Smart Finance
                </h1>
                <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sync active
                </p>
              </div>
            </div>

            {/* Right: Search & Calendar action buttons */}
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Search transactions"
              >
                <SearchIcon className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Filter by date"
              >
                <CalendarIcon className="size-5" />
              </Button>
            </div>

            {/* Full-width Cashbook dropdown menu matching reference screenshot */}
            <CashbookMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
            />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden pb-16">
            <Outlet />
          </main>
        </div>

        <BottomNav onFabClick={handleFabClick} />

        {/* Global Select Category & Add/Edit Transaction Modal */}
        <SelectCategoryModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSubmit={handleTransactionSubmit}
          isSubmitting={isSubmitting}
          editTransaction={editTransaction}
        />
      </div>
    </FabContext.Provider>
  );
}

export default AppLayout;
