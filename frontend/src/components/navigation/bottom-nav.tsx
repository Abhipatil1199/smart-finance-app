import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  PieChartIcon,
  FileBarChartIcon,
  UserIcon,
  PlusIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ROUTES } from "@/app/router/paths";

const LEFT_ITEMS = [
  {
    name: "Home",
    path: ROUTES.dashboard,
    icon: HomeIcon,
  },
  {
    name: "Charts",
    path: ROUTES.income,
    icon: PieChartIcon,
  },
];

const RIGHT_ITEMS = [
  {
    name: "Reports",
    path: ROUTES.reports,
    icon: FileBarChartIcon,
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
 * Mobile bottom navigation bar matching the Stitch design.
 * Features a frosted glass background, 4 tab items, and a
 * permanently elevated FAB (+) button in the center.
 */
export function BottomNav({ onFabClick }: BottomNavProps) {
  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md pb-safe"
    >
      <div className="mx-auto max-w-md">
        <ul className="flex h-16 items-center justify-between px-6">
          {/* Left nav items */}
          {LEFT_ITEMS.map((item) => (
            <NavItem key={item.name} {...item} />
          ))}

          {/* Centered Elevated FAB (+) */}
          <li className="flex-1">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={onFabClick}
                className={cn(
                  "relative -mt-8 flex size-14 items-center justify-center rounded-full",
                  "border-4 border-background bg-amber-300 text-slate-900 shadow-lg",
                  "transition-all duration-200 hover:scale-105 hover:bg-amber-400 hover:shadow-xl",
                  "active:scale-95 active:shadow-md",
                  /* Yellow glow effect */
                  "shadow-amber-300/40"
                )}
                aria-label="Add new entry"
              >
                <PlusIcon className="size-7" strokeWidth={2.8} />
              </button>
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

/** Single nav item with active-state styling matching the Stitch design. */
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
            "flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors",
            isActive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-muted-foreground hover:text-foreground"
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "grid size-8 place-items-center rounded-xl transition-all duration-200",
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/30"
                  : "bg-transparent"
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  isActive && "stroke-[2.3]"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[11px] tracking-tight",
                isActive ? "font-bold" : "font-medium"
              )}
            >
              {name}
            </span>
          </>
        )}
      </NavLink>
    </li>
  );
}
