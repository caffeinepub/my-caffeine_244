import { Footer } from "@/components/shared/Footer";
import { Header } from "@/components/shared/Header";
import { Toaster } from "@/components/ui/sonner";
import { useSampleData } from "@/hooks/useSampleData";
import { AdminPage } from "@/pages/AdminPage";
import { ComparePage } from "@/pages/ComparePage";
import { HomePage } from "@/pages/HomePage";
import { LawyersPage } from "@/pages/LawyersPage";
import { ListingDetailPage } from "@/pages/ListingDetailPage";
import { ListingsPage } from "@/pages/ListingsPage";
import { NewsPage } from "@/pages/NewsPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root layout component
function RootLayout() {
  useSampleData();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const listingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings",
  component: ListingsPage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/listings/$id",
  component: ListingDetailPage,
});

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/compare",
  component: ComparePage,
});

const lawyersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/lawyers",
  component: LawyersPage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: NewsPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingsRoute,
  listingDetailRoute,
  compareRoute,
  lawyersRoute,
  newsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
