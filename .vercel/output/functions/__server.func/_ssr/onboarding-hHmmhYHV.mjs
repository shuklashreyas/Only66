import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as enableBackgroundPush, s as syncReminderChallengeSnapshot } from "./push-Boql1Gc_.mjs";
import { t as todayIso } from "./day-math-OKL4F-bz.mjs";
import { j as getUserDisplayName, k as setUserDisplayName, a as createChallenge, h as getLocalUser } from "./router-CKEh3UVe.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./server-BDbOBauc.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/lucide-react.mjs";
function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = reactExports.useState(1);
  const [kind, setKind] = reactExports.useState("build");
  const [name, setName] = reactExports.useState("");
  const [motivation, setMotivation] = reactExports.useState("");
  const [tone, setTone] = reactExports.useState("strict");
  const [reminderTime, setReminderTime] = reactExports.useState("09:00");
  const [displayName, setDisplayName] = reactExports.useState("");
  const existingDisplayName = getUserDisplayName();
  const [submitting, setSubmitting] = reactExports.useState(false);
  const handleStart = async () => {
    setSubmitting(true);
    try {
      if (!existingDisplayName && displayName.trim()) {
        setUserDisplayName(displayName);
      }
      const createdChallenge = createChallenge({
        name: name.trim(),
        kind,
        motivation: motivation.trim() || null,
        tone,
        start_date: todayIso(),
        reminder_time: reminderTime + ":00",
        status: "active"
      });
      const localUser = getLocalUser();
      if (localUser) {
        let notificationEnabled = false;
        try {
          const pushState = await enableBackgroundPush(localUser.id);
          notificationEnabled = pushState.subscribed;
        } catch (error) {
          console.error("Failed to enable background push during onboarding", error);
        }
        await syncReminderChallengeSnapshot({
          data: {
            localUserId: localUser.id,
            displayName: getUserDisplayName(),
            challenge: {
              localChallengeId: createdChallenge.id,
              challengeName: createdChallenge.name,
              tone: createdChallenge.tone,
              startDate: createdChallenge.start_date,
              reminderTime: createdChallenge.reminder_time,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
              status: createdChallenge.status,
              notificationEnabled
            }
          }
        }).catch((error) => {
          console.error("Failed to mirror reminder challenge during onboarding", error);
        });
      }
      toast.success("Challenge started!");
      navigate({
        to: "/dashboard",
        replace: true
      });
      setSubmitting(false);
    } catch (err) {
      toast.error(err.message || "Could not start challenge");
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mx-auto max-w-3xl px-6 py-4 font-display text-2xl block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "ONLY" }),
      " 66"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 mx-auto w-full max-w-2xl px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3", children: [
        "[ STEP ",
        step,
        " / 4 ]"
      ] }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl uppercase", children: "What are you doing?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: ["build", "quit"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setKind(k), className: `rounded-sm border p-6 text-left transition ${kind === k ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-2xl uppercase", children: k === "build" ? "Build it" : "Quit it" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: k === "build" ? "Do this thing every day for 66 days." : "Don't do this thing for 66 days." })
        ] }, k)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground", children: "Next" })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl uppercase", children: "Name the habit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: name, onChange: (e) => setName(e.target.value), placeholder: kind === "build" ? "e.g. Workout 20 min" : "e.g. No scrolling after 10pm", className: "w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono", maxLength: 80 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: motivation, onChange: (e) => setMotivation(e.target.value), placeholder: "Why? (optional — read this when you're about to fold)", rows: 3, maxLength: 280, className: "w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider", children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !name.trim(), onClick: () => setStep(3), className: "rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground disabled:opacity-40", children: "Next" })
        ] })
      ] }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl uppercase", children: "Pick your tone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "How should we talk to you?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3", children: [["strict", "Drill sergeant", "No excuses. No softness."], ["brutal", "Brutal honest", "Cold truth. You signed up for this."], ["chill", "Chill coach", "Warm and rooting for you."], ["funny", "Goblin mode", "Unhinged. Possibly threatening."]].map(([val, label, desc]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTone(val), className: `rounded-sm border p-4 text-left transition ${tone === val ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xl uppercase", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm text-muted-foreground", children: desc })
        ] }, val)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider", children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(4), className: "rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground", children: "Next" })
        ] })
      ] }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl uppercase", children: "Reminder time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "We'll ping your browser daily at this time. You'll be asked for permission after this." }),
        !existingDisplayName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "What should we call you?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "Optional", className: "w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono", maxLength: 50 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", value: reminderTime, onChange: (e) => setReminderTime(e.target.value), className: "rounded-sm border border-border bg-surface px-4 py-3 font-mono text-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-border bg-surface p-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2", children: "[ CONFIRM ]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Habit:" }),
            " ",
            name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Kind:" }),
            " ",
            kind
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Tone:" }),
            " ",
            tone
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Reminder:" }),
            " ",
            reminderTime
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), className: "rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider", children: "Back" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: submitting, onClick: handleStart, className: "rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground disabled:opacity-50", children: submitting ? "Starting..." : "Start Day 1" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Onboarding as component
};
