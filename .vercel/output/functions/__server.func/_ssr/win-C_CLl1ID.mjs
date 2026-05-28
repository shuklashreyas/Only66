import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { g as getActiveChallengeForUser, u as updateChallenge } from "./router-CKAbYjWb.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function WinPage() {
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("the habit");
  reactExports.useEffect(() => {
    const challenge = getActiveChallengeForUser();
    if (challenge) setName(challenge.name);
  }, []);
  const handleNew = () => {
    const challenge = getActiveChallengeForUser();
    if (challenge) {
      updateChallenge(challenge.id, {
        status: "completed"
      });
    }
    navigate({
      to: "/onboarding"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-4 font-display text-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "ONLY" }),
      " 66"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl text-center animate-survived-pop", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-reward)] mb-4", children: "[ DAY 66 / 66 — SURVIVED ]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl uppercase", children: "You won." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-lg text-muted-foreground", children: [
        "66 days of ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: name }),
        ". The habit is yours."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleNew, className: "rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground", children: "Start another 66" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider", children: "Home" })
      ] })
    ] }) })
  ] });
}
export {
  WinPage as component
};
