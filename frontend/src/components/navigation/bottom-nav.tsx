import { NavLink, useLocation } from "react-router-dom";
import {
  WalletIcon,
  LayoutDashboardIcon,
  UserIcon,
  PieChartIcon,
  PlusIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/router/paths";

const LEFT_ITEMS = [
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
];

const RIGHT_ITEMS = [
  {
    name: "Reports",
    path: ROUTES.reports,
    icon: PieChartIcon,
  },
  {
    name: "Profile",
    path: ROUTES.profile,
    icon: UserIcon,
  },
];

interface BottomNavProps {
  /** Callback fired when the centered FAB is pressed. */
  onFabClick?: () => void;
}

/**
 * Mobile bottom navigation bar with a centered FAB (+) button.
 * The FAB only appears on the Income page and fires onFabClick.
 * Always visible at the bottom of the screen.
 */
export function BottomNav({ onFabClick }: BottomNavProps) {
  const location = useLocation();
  const showFab = location.pathname === ROUTES.income;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-safe">
      <div className="mx-auto max-w-md">
        <ul className="flex h-16 items-center justify-around px-2">
          {/* Left nav items */}
          {LEFT_ITEMS.map((item) => (
            <NavItem key={item.name} {...item} />
          ))}

          {/* Centered FAB */}
          <li className="flex-1">
            <div className="flex items-center justify-center">
              {showFab ? (
                <button
                  type="button"
                  onClick={onFabClick}
                  className={cn(
                    "relative -mt-8 flex size-14 items-center justify-center rounded-full",
                    "bg-amber-300 text-amber-900 shadow-lg",
                    "transition-all duration-200 hover:bg-amber-400 hover:shadow-xl",
                    "active:scale-95 active:shadow-md"
                  )}
                  aria-label="Add income"
                >
                  <PlusIcon className="size-7" strokeWidth={2.5} />
                </button>
              ) : (
                /* Empty spacer when FAB is hidden so items stay balanced */
                <div className="size-14" />
              )}
            </div>
          </li>

          {/* Right nav items */}
          {RIGHT_ITEMS.map((item) => (
            <NavItem key={item.name} {...item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** Single nav item extracted to reduce duplication. */
function NavItem({
  name,
  path,
  icon: Icon,
}: {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <li className="flex-1">
      <NavLink
        to={path}
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
            <span>{name}</span>
          </>
        )}
      </NavLink>
    </li>
  );
}
