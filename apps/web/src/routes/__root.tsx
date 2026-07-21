import { Toaster } from "@all-chat/ui/components/sonner";
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import "../index.css";

export interface RouterAppContext {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: "all-chat",
      },
      {
        name: "description",
        content: "all-chat is a web application",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/logo.svg",
      },
    ],
  }),
});
const queryClient = new QueryClient();

function RootComponent() {
  const { pathname } = useLocation();
  const hideHeader = pathname.startsWith("/my-rooms");
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <HeadContent />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          storageKey="vite-ui-theme"
        >
          <div className="h-svh">
            {!hideHeader && <Header />}
            <Outlet />
          </div>
          <Toaster richColors />
        </ThemeProvider>
        <TanStackRouterDevtools position="bottom-left" />
      </QueryClientProvider>
    </>
  );
}
