import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { d as createLocalUser } from "./router-YVwZTNu5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
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
function LoginPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const name = displayName.trim();
      if (!name) {
        toast.error("Please enter a name");
        setLoading(false);
        return;
      }
      createLocalUser(name);
      toast.success(`Welcome, ${name}!`);
      await navigate({
        to: "/onboarding",
        replace: true
      });
      setLoading(false);
    } catch (err) {
      toast.error(err.message || "Could not sign in");
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-6 py-4 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "font-display text-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "ONLY" }),
      " 66"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "[ ENLIST ]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl uppercase mb-8", children: "Join the streak" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2", children: "Display name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", required: true, autoFocus: true, placeholder: "Your name", value: displayName, onChange: (e) => setDisplayName(e.target.value), className: "w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary", maxLength: 50 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full rounded-sm bg-primary py-3 font-display uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50", children: loading ? "..." : "Enlist" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs font-mono text-muted-foreground", children: "This MVP stores everything locally. No account needed." })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
