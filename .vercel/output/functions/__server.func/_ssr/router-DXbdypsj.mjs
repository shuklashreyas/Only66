import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { b as createRouter, a as createRootRouteWithContext, d as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, c as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { G as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const appCss = "/assets/styles-Ci0PVQ0p.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-display text-primary", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-display text-foreground", children: "Signal lost" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground font-mono", children: "This page didn't survive the 66." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-display uppercase tracking-wider text-primary-foreground",
        children: "Back to base"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display text-foreground uppercase", children: "System fault" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground font-mono", children: "Something cracked. Try again." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-display uppercase tracking-wider text-primary-foreground",
          children: "Retry"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-sm border border-border bg-background px-4 py-2 text-sm font-display uppercase tracking-wider text-foreground",
          children: "Home"
        }
      )
    ] })
  ] }) });
}
const Route$7 = createRootRouteWithContext()({
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
      { name: "twitter:image", content: "/logo.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$7.useRouteContext();
  reactExports.useEffect(() => {
    import("./sound--O_4J7dP.mjs").then(({ wireGlobalClickSound, playBgm }) => {
      wireGlobalClickSound();
      const startOnGesture = () => {
        playBgm();
        window.removeEventListener("pointerdown", startOnGesture);
        window.removeEventListener("keydown", startOnGesture);
      };
      window.addEventListener("pointerdown", startOnGesture);
      window.addEventListener("keydown", startOnGesture);
    });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] });
}
const STORAGE_KEYS = {
  user: "only66_user",
  challenges: "only66_challenges",
  checkIns: "only66_checkIns"
};
function getLocalUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.user);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
function setLocalUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}
function createLocalUser(displayName) {
  const user = {
    id: generateId(),
    displayName,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  setLocalUser(user);
  return user;
}
function clearLocalUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}
function getChallenges() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.challenges);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function getActiveChallenges() {
  return getChallenges().filter((c) => c.status === "active");
}
function getLatestAbandonedChallenge() {
  const challenges = getChallenges();
  for (let index = challenges.length - 1; index >= 0; index--) {
    if (challenges[index].status === "abandoned") {
      return challenges[index];
    }
  }
  return null;
}
function getActiveChallengeForUser() {
  return getActiveChallenges()[0] ?? null;
}
function createChallenge(data) {
  const challenge = {
    ...data,
    id: generateId(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const challenges = getChallenges();
  challenges.push(challenge);
  localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(challenges));
  return challenge;
}
function updateChallenge(id, updates) {
  const challenges = getChallenges();
  const idx = challenges.findIndex((c) => c.id === id);
  if (idx !== -1) {
    challenges[idx] = { ...challenges[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(challenges));
  }
}
function getCheckIns() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.checkIns);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function getCheckInsForChallenge(challengeId) {
  return getCheckIns().filter((c) => c.challenge_id === challengeId).sort((a, b) => a.day_number - b.day_number);
}
function createCheckIn(data) {
  const checkIn = {
    ...data,
    id: generateId(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const checkIns = getCheckIns();
  checkIns.push(checkIn);
  localStorage.setItem(STORAGE_KEYS.checkIns, JSON.stringify(checkIns));
  return checkIn;
}
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const $$splitComponentImporter$6 = () => import("./login-D3biVRhN.mjs");
const Route$6 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Log in — Only 66"
    }]
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const user = getLocalUser();
    if (user) {
      const activeChallenge = getActiveChallengeForUser();
      throw redirect({
        to: activeChallenge ? "/dashboard" : "/onboarding"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("../_authenticated-BFsOu0JM.mjs");
const Route$5 = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const user = getLocalUser();
    if (!user) {
      throw redirect({
        to: "/login"
      });
    }
    return {
      userId: user.id
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-DFTxt5Om.mjs");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Only 66 — Pick one habit. Survive 66 days."
    }, {
      name: "description",
      content: "A gamified 66-day habit tracker. Pick one habit, protect your streak, make it to Day 66."
    }, {
      property: "og:title",
      content: "Only 66"
    }, {
      property: "og:description",
      content: "Pick one habit. Survive 66 days."
    }, {
      property: "og:image",
      content: "/logo.png"
    }, {
      property: "og:image:alt",
      content: "Only 66 logo"
    }, {
      name: "twitter:image",
      content: "/logo.png"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./win-Dx7L__dZ.mjs");
const Route$3 = createFileRoute("/_authenticated/win")({
  head: () => ({
    meta: [{
      title: "Day 66 — You won. Only 66"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./onboarding-C1i9sXXX.mjs");
const Route$2 = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{
      title: "Choose your challenge — Only 66"
    }]
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const activeChallenge = getActiveChallengeForUser();
    if (activeChallenge) throw redirect({
      to: "/dashboard"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./folded-C9Mx6jIp.mjs");
const Route$1 = createFileRoute("/_authenticated/folded")({
  head: () => ({
    meta: [{
      title: "You folded — Only 66"
    }]
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const challenge = getLatestAbandonedChallenge();
    if (!challenge) {
      throw redirect({
        to: "/onboarding"
      });
    }
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./dashboard-DuXpaV46.mjs");
const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Only 66"
    }]
  }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }
    const challenge = getActiveChallengeForUser();
    if (!challenge) throw redirect({
      to: "/onboarding"
    });
    if (challenge.status === "completed") throw redirect({
      to: "/win"
    });
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$6.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$7
});
const AuthenticatedRoute = Route$5.update({
  id: "/_authenticated",
  getParentRoute: () => Route$7
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$7
});
const AuthenticatedWinRoute = Route$3.update({
  id: "/win",
  path: "/win",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedOnboardingRoute = Route$2.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedFoldedRoute = Route$1.update({
  id: "/folded",
  path: "/folded",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedDashboardRoute = Route.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute
});
const AuthenticatedRouteChildren = {
  AuthenticatedDashboardRoute,
  AuthenticatedFoldedRoute,
  AuthenticatedOnboardingRoute,
  AuthenticatedWinRoute
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute
};
const routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  createChallenge as a,
  createCheckIn as b,
  clearLocalUser as c,
  createLocalUser as d,
  getCheckInsForChallenge as e,
  getLatestAbandonedChallenge as f,
  getActiveChallengeForUser as g,
  router as r,
  updateChallenge as u
};
