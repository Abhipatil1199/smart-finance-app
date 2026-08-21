import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSignoutMutation } from "@/features/auth/hooks/use-signout-mutation";

/**
 * Placeholder landing surface so the auth flow has somewhere to finish.
 * Replace with the real dashboard feature; the route and guard stay as-is.
 */
export function DashboardPage() {
  const { user } = useAuth();
  const signoutMutation = useSignoutMutation();

  return (
    <div className="min-h-screen-safe bg-background px-safe">
      <header className="flex items-center justify-between gap-3 px-5 pt-safe sm:px-8">
        <div className="flex h-16 items-center">
          <BrandMark />
        </div>
        <div className="flex h-16 items-center gap-1">
          <ThemeToggle />
          <Button
            type="button"
            variant="outline"
            size="xl"
            disabled={signoutMutation.isPending}
            onClick={() => signoutMutation.mutate()}
          >
            {signoutMutation.isPending ? <Spinner /> : null}
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-10 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              You're signed in{user ? `, ${user.name.split(" ")[0]}` : ""}.
            </CardTitle>
            <CardDescription>
              Authentication works end to end. The dashboard feature plugs in here.
            </CardDescription>
          </CardHeader>
          {user ? (
            <CardContent>
              <dl className="grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{user.name}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium break-all">{user.email}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{user.phone}</dd>
              </dl>
            </CardContent>
          ) : null}
        </Card>
      </main>
    </div>
  );
}

export default DashboardPage;
