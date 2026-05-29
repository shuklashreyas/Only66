import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { f as getLatestAbandonedChallenge } from "./router-BnWGtkIF.mjs";
import { play } from "./sound--O_4J7dP.mjs";
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
import "../_libs/lucide-react.mjs";
function FoldedPage() {
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("the habit");
  reactExports.useEffect(() => {
    const challenge = getLatestAbandonedChallenge();
    if (!challenge) {
      navigate({
        to: "/onboarding"
      });
      return;
    }
    setName(challenge.name);
    play("gameover");
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mx-auto max-w-3xl px-6 py-4 font-display text-2xl block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "ONLY" }),
      " 66"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xl text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "[ STREAK BROKEN ]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl uppercase", children: "You folded." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-lg text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: name }),
        " beat you this round. The grid remembers. Start over if you want another shot at 66."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
          to: "/onboarding"
        }), className: "rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground", children: "Start again" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider", children: "Home" })
      ] })
    ] }) })
  ] });
}
export {
  FoldedPage as component
};
