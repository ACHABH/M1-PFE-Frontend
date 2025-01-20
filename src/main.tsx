import React from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import Loading from "./loading.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "./index.css";

import { routeTree } from "./routeTree.gen";
import ThemeProvider from "./contexts/theme.tsx";
import QueryProvider from "./providers/query.tsx";
import ErrorBoundary from "./error-boundary.tsx";
import SchedulerProvider from "./contexts/scheduler.tsx";
// import { sql } from "./api/sql.ts";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  // sql("select", "select * from users");
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <React.Suspense fallback={<Loading />}>
          <QueryProvider>
            <ThemeProvider>
              {/* <SchedulerProvider> */}
                <RouterProvider router={router} />
              {/* </SchedulerProvider> */}
            </ThemeProvider>
          </QueryProvider>
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
