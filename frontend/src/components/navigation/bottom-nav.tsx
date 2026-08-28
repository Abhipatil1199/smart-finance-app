import { NavLink } from "react-router-dom";
import { WalletIcon, LayoutDashboardIcon, UserIcon, PieChartIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/router/paths";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    path: ROUTES.dashboard,
    icon: LayoutDashboardIcon,
  },
  {
    name: "Income",
    path: ROUTES.income,
    icon: WalletIcon,
  },
  {
    name: "Reports",
    path: "/reports", // Placeholder for future route
    icon: PieChartIcon,
  },
  {
    name: "Profile",
    path: "/profile", // Placeholder for future route
    icon: UserIcon,
  },
];

/**
 * Mobile bottom navigation bar.
 * Always visible at the bottom of the screen (no responsive hiding).
 * Includes padding for safe areas on mobile devices (e.g. iOS home indicator).
 */
export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-safe">
      {/* We constrain the inner content to max-w-md so it aligns with the AppLayout */}
      <div className="mx-auto max-w-md">
        <ul className="flex h-16 items-center justify-around px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name} className="flex-1">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[0.625rem] font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={cn(
                          "grid size-8 place-items-center rounded-full transition-all duration-300",
                          isActive ? "bg-primary/10" : "bg-transparent"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-5 transition-transform duration-300",
                            isActive && "scale-110"
                          )}
                        />
                      </div>
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
