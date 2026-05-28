import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
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
const COLS = 11;
const ROWS = 6;
const TOTAL = COLS * ROWS;
function WallHero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "aria-label": "The 66-Day Wall: a perspective grid of 66 survival cells. Day 1 glows red, Day 66 glows gold.",
      role: "img",
      className: "relative isolate flex items-center justify-center md:justify-end h-[420px] md:h-[520px] select-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": true,
            className: "absolute inset-0 m-auto h-[70%] w-[80%] rounded-[40%] bg-primary/25 blur-3xl animate-wall-glow"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "aria-hidden": true,
            className: "absolute right-[6%] top-[28%] h-40 w-40 rounded-full bg-[color:var(--color-reward)]/30 blur-3xl"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "aria-hidden": true, className: "absolute inset-0 wall-scanlines opacity-40 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative w-full max-w-[560px] aspect-[11/7] wall-perspective",
            "aria-hidden": true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wall-tilt absolute inset-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid h-full w-full gap-[6px]",
                style: {
                  gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`
                },
                children: Array.from({ length: TOTAL }, (_, i) => {
                  const day = i + 1;
                  const isStart = day === 1;
                  const isFinal = day === TOTAL;
                  const isMilestone = day === 22 || day === 44;
                  let cls = "border border-border/40 bg-surface/30 text-muted-foreground/40";
                  let label = null;
                  if (isStart) {
                    cls = "border border-primary bg-primary/80 text-primary-foreground shadow-[0_0_18px_oklch(0.62_0.24_25/0.75)] animate-pulse-red";
                    label = "01";
                  } else if (isFinal) {
                    cls = "border-2 border-[color:var(--color-reward)] bg-[color:var(--color-reward)]/30 text-[color:var(--color-reward)] shadow-[0_0_22px_oklch(0.85_0.18_90/0.7)]";
                    label = "★";
                  } else if (isMilestone) {
                    cls = "border border-[color:var(--color-reward)]/40 bg-surface/60 text-[color:var(--color-reward)]/70";
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `rounded-[2px] flex items-center justify-center font-mono text-[9px] tracking-widest ${cls}`,
                      children: label
                    },
                    day
                  );
                })
              }
            ) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-2 bottom-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80", children: "[ DAY 01 — START ]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-2 top-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-reward)]/80", children: "[ DAY 66 — FINAL ]" })
      ]
    }
  );
}
const EXAMPLES = ["No sugar", "Workout 20 min", "No scrolling after 10pm", "Read 10 pages", "No alcohol", "Cold shower", "Meditate 5 min", "No fast food"];
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-display text-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "ONLY" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "66" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "rounded-sm border border-border px-4 py-2 text-xs font-display uppercase tracking-wider hover:bg-surface", children: "Log in" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-6xl px-6 pt-20 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 md:grid-cols-2 md:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6", children: "[ DAY 00 / 66 — INITIATE ]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-6xl md:text-7xl lg:text-8xl leading-[0.95] uppercase", children: [
          "Pick one habit.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Survive 66 days." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 max-w-xl text-lg text-muted-foreground", children: "Only 66 is a brutal little habit tracker. One challenge. One streak. Make it to Day 66. If you fold, the grid remembers." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-wrap gap-3", children: EXAMPLES.map((ex) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-sm border border-border bg-surface px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground", children: ex }, ex)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 font-display text-lg uppercase tracking-wider text-primary-foreground hover:opacity-90", children: "Start your 66" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#how", className: "inline-flex items-center justify-center rounded-sm border border-border px-8 py-4 font-display text-lg uppercase tracking-wider hover:bg-surface", children: "How it works" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WallHero, {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "how", className: "border-t border-border bg-surface/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl uppercase", children: "The protocol" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid gap-6 md:grid-cols-3", children: [{
        n: "01",
        t: "Pick one habit",
        d: "Build or break. One thing. No portfolio of half-attempts."
      }, {
        n: "02",
        t: "Check in daily",
        d: "Every day you survive, you stamp the grid. Streak grows. Survival Meter holds."
      }, {
        n: "03",
        t: "Don't fold",
        d: "Hit the panic button when you're about to break. Survive the urge. Repeat 66 times."
      }].map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-border bg-background p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs text-primary tracking-widest", children: step.n }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 font-display text-2xl uppercase", children: step.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: step.d })
      ] }, step.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4", children: "[ WHY 66 ]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl uppercase", children: [
        "66 days is the average time",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "a habit becomes automatic." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground", children: "Not 21. Not 30. Sixty-six. We didn't make that up — researchers did. We just made it impossible to ignore." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t border-border bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-6 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-5xl uppercase", children: "Ready to enlist?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "One habit. 66 days. No refunds." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "mt-8 inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 font-display text-lg uppercase tracking-wider text-primary-foreground hover:opacity-90", children: "Start your 66" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-6 py-6 font-mono text-xs uppercase tracking-widest text-muted-foreground", children: "Only 66 — Survive or restart." }) })
  ] });
}
export {
  Landing as component
};
