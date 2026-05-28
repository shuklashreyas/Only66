import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-primary">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground font-mono">
          This page didn't survive the 66.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-display uppercase tracking-wider text-primary-foreground"
          >
            Back to base
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-display text-foreground uppercase">System fault</h1>
        <p className="mt-2 text-sm text-muted-foreground font-mono">
          Something cracked. Try again.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-display uppercase tracking-wider text-primary-foreground"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-border bg-background px-4 py-2 text-sm font-display uppercase tracking-wider text-foreground"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Only 66 — Survive 66 days. Build the habit." },
      { name: "description", content: "Pick one habit. Survive 66 days. Protect your streak or lose it all." },
      { property: "og:title", content: "Only 66" },
      { property: "og:description", content: "Pick one habit. Survive 66 days." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/logo.png" },
      { property: "og:image:alt", content: "Only 66 logo" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:image", content: "/logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    import("@/lib/sound").then(({ wireGlobalClickSound, playBgm }) => {
      wireGlobalClickSound();
      // BGM only starts after a user gesture (browser autoplay rules).
      const startOnGesture = () => {
        playBgm();
        window.removeEventListener("pointerdown", startOnGesture);
        window.removeEventListener("keydown", startOnGesture);
      };
      window.addEventListener("pointerdown", startOnGesture);
      window.addEventListener("keydown", startOnGesture);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}

