import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useTheme } from "../contexts/theme";
import NavigationMotionLayout from "../layout/navigation-motion";
import NotFound from "../not-found";
import { useAuth } from "../api/auth";
import Loading from "../loading";
import TopNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeProvider from '../contexts/theme';

function ThemeMode() {
  const { theme, toggleTheme } = useTheme()!;
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const user = useAuth();

  return (
    <ThemeProvider>
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1" style={{ marginTop: '72px' }}>
          <Suspense fallback={<Loading />}>
        <TopNavbar />
            <Outlet />
        <Footer />
          </Suspense>
        </main>
      </div>
    </ThemeProvider>
  );
}
