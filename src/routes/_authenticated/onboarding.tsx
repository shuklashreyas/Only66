import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { syncReminderChallengeSnapshot } from "@/lib/api/push.functions";
import { todayIso } from "@/lib/day-math";
import { enableBackgroundPush } from "@/lib/push";
import { createChallenge, getActiveChallengeForUser, getLocalUser, getUserDisplayName, setUserDisplayName } from "@/lib/storage";
import type { Tone } from "@/lib/tone";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Choose your challenge — Only 66" }] }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }

    const activeChallenge = getActiveChallengeForUser();
    if (activeChallenge) throw redirect({ to: "/dashboard" });
  },
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [kind, setKind] = useState<"build" | "quit">("build");
  const [name, setName] = useState("");
  const [motivation, setMotivation] = useState("");
  const [tone, setTone] = useState<Tone>("strict");
  const [reminderTime, setReminderTime] = useState("09:00");
  const [displayName, setDisplayName] = useState("");
  const existingDisplayName = getUserDisplayName();
  const [submitting, setSubmitting] = useState(false);

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
        status: "active",
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
              notificationEnabled,
            },
          },
        }).catch((error) => {
          console.error("Failed to mirror reminder challenge during onboarding", error);
        });
      }

      toast.success("Challenge started!");
      navigate({ to: "/dashboard", replace: true });
      setSubmitting(false);
    } catch (err: any) {
      toast.error(err.message || "Could not start challenge");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <Link to="/" className="mx-auto max-w-3xl px-6 py-4 font-display text-2xl block">
          <span className="text-primary">ONLY</span> 66
        </Link>
      </header>

      <div className="flex-1 mx-auto w-full max-w-2xl px-6 py-12">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
          [ STEP {step} / 4 ]
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h1 className="font-display text-4xl uppercase">What are you doing?</h1>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["build", "quit"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setKind(k)}
                  className={`rounded-sm border p-6 text-left transition ${
                    kind === k ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2"
                  }`}
                >
                  <div className="font-display text-2xl uppercase">{k === "build" ? "Build it" : "Quit it"}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {k === "build" ? "Do this thing every day for 66 days." : "Don't do this thing for 66 days."}
                  </p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h1 className="font-display text-4xl uppercase">Name the habit</h1>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={kind === "build" ? "e.g. Workout 20 min" : "e.g. No scrolling after 10pm"}
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono"
              maxLength={80}
            />
            <textarea
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Why? (optional — read this when you're about to fold)"
              rows={3}
              maxLength={280}
              className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono text-sm"
            />
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider">Back</button>
              <button
                disabled={!name.trim()}
                onClick={() => setStep(3)}
                className="rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h1 className="font-display text-4xl uppercase">Pick your tone</h1>
            <p className="text-muted-foreground text-sm">How should we talk to you?</p>
            <div className="grid gap-3">
              {([
                ["strict", "Drill sergeant", "No excuses. No softness."],
                ["brutal", "Brutal honest", "Cold truth. You signed up for this."],
                ["chill", "Chill coach", "Warm and rooting for you."],
                ["funny", "Goblin mode", "Unhinged. Possibly threatening."],
              ] as const).map(([val, label, desc]) => (
                <button
                  key={val}
                  onClick={() => setTone(val)}
                  className={`rounded-sm border p-4 text-left transition ${
                    tone === val ? "border-primary bg-primary/10" : "border-border bg-surface hover:bg-surface-2"
                  }`}
                >
                  <div className="font-display text-xl uppercase">{label}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider">Back</button>
              <button onClick={() => setStep(4)} className="rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h1 className="font-display text-4xl uppercase">Reminder time</h1>
            <p className="text-muted-foreground text-sm">
              We'll ping your browser daily at this time. You'll be asked for permission after this.
            </p>

            {!existingDisplayName && (
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  What should we call you?
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-sm border border-border bg-surface px-4 py-3 font-mono"
                  maxLength={50}
                />
              </div>
            )}

            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="rounded-sm border border-border bg-surface px-4 py-3 font-mono text-lg"
            />
            <div className="rounded-sm border border-border bg-surface p-4 text-sm">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">[ CONFIRM ]</div>
              <div><span className="text-muted-foreground">Habit:</span> {name}</div>
              <div><span className="text-muted-foreground">Kind:</span> {kind}</div>
              <div><span className="text-muted-foreground">Tone:</span> {tone}</div>
              <div><span className="text-muted-foreground">Reminder:</span> {reminderTime}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider">Back</button>
              <button
                disabled={submitting}
                onClick={handleStart}
                className="rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground disabled:opacity-50"
              >
                {submitting ? "Starting..." : "Start Day 1"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
