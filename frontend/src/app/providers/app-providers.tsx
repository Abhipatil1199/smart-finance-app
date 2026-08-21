import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { createQueryClient } from "@/app/providers/query-client";
import { ThemeProvider } from "@/app/providers/theme-provider";
import { AuthProvider } from "@/features/auth/components/auth-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Created in state, not at module scope, so the cache is per-app-instance
  // and never shared across tests or a future SSR render.
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {/* Inside the query provider: ending a session clears the cache. */}
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
