import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import { env } from "@/lib/env";
import api from "@/services/api/axios";
import { AppProviders } from "@/app/providers/app-providers";
import { router } from "@/app/router";

async function bootstrap() {
  // Dynamic import so the fixture is emitted as its own chunk and is never
  // fetched — or shipped — when the real API is in use.
  if (env.enableMockApi) {
    const { installMockApi } = await import("@/services/api/mock/install-mock-api");
    installMockApi(api);
  }

  const container = document.getElementById("root");
  if (!container) throw new Error('Root element "#root" was not found.');

  createRoot(container).render(
    <StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>
  );
}

void bootstrap();
