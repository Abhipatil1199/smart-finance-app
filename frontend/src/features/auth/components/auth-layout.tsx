import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { AuthShowcasePanel } from "@/features/auth/components/auth-showcase-panel";
import { ROUTES } from "@/app/router/paths";

type AuthLayoutProps = {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  /** Rendered under the card, e.g. the link to the opposite auth page. */
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Shell shared by both auth screens.
 *
 * Single column on phones; from `lg` up, a brand panel takes the left half and
 * the form sits on the right. Vertical padding uses the safe-area utilities so
 * the header clears a notch and the footer clears the home indicator when this
 * runs inside the Capacitor WebView.
 */
export function AuthLayout({ title, subtitle, children, footer, className }: AuthLayoutProps) {
  return (
    <div className="min-h-screen-safe bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <AuthShowcasePanel />

      <div className="flex min-h-screen-safe flex-col px-safe lg:min-h-0">
        <header className="flex items-center justify-between gap-3 px-5 pt-safe sm:px-8">
          <div className="flex h-16 items-center">
            <Link
              to={ROUTES.signin}
              aria-label="Smart Finance home"
              className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
            >
              <BrandMark />
            </Link>
          </div>
          <div className="flex h-16 items-center">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-6 sm:px-8 sm:py-10">
          <div className={cn("w-full max-w-md", className)}>
            <Card className="gap-6 bg-card shadow-lg shadow-primary/5 ring-border/70 dark:shadow-black/20">
              <CardHeader className="gap-1.5">
                <CardTitle className="text-2xl leading-tight font-semibold tracking-tight">
                  {title}
                </CardTitle>
                <CardDescription className="text-[0.9375rem] text-pretty">
                  {subtitle}
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-6">{children}</CardContent>
            </Card>

            {footer ? (
              <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
            ) : null}
          </div>
        </main>

        <footer className="px-5 pb-safe text-center sm:px-8">
          <p className="pb-5 text-xs text-muted-foreground">
            Bank-grade encryption. Your data stays yours.
          </p>
        </footer>
      </div>
    </div>
  );
}
