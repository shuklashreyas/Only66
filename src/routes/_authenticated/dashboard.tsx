import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { TOTAL_DAYS, dayNumber, todayIso } from "@/lib/day-math";
import { pickReminder, pickProtocol, PANIC_LINES, MILESTONES, FINAL_DAY, type Tone } from "@/lib/tone";
import { pickDailyQuote } from "@/lib/quotes";
import { getActiveChallengeForUser, getCheckInsForChallenge, getLocalUser, updateChallenge, type LocalChallenge, type LocalCheckIn, type LocalUser } from "@/lib/storage";
import { CheckInModal } from "@/components/dashboard/CheckInModal";
import { PanicModal } from "@/components/dashboard/PanicModal";
import { SettingsSheet } from "@/components/dashboard/SettingsSheet";
import { SoundToggle } from "@/components/SoundToggle";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Only 66" }] }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }

    const challenge = getActiveChallengeForUser();
    if (!challenge) throw redirect({ to: "/onboarding" });
    if (challenge.status === "completed") throw redirect({ to: "/win" });
  },
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<LocalChallenge | null>(null);
  const [checkIns, setCheckIns] = useState<LocalCheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newlyUnlockedDay, setNewlyUnlockedDay] = useState<number | null>(null);
  const hasInitializedRef = useRef(false);
  const prevTodayDoneRef = useRef(false);

  const load = () => {
    const ch = getActiveChallengeForUser();
    if (!ch) { navigate({ to: "/onboarding" }); return; }
    setChallenge(ch);
    const cins = getCheckInsForChallenge(ch.id);
    setCheckIns(cins);
    setLoading(false);
  };

  const fold = () => {
    if (!challenge) return;

    updateChallenge(challenge.id, { status: "abandoned" });
    toast("Challenge abandoned.");
    setShowPanic(false);
    navigate({ to: "/folded" });
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    setLocalUser(getLocalUser());
  }, []);

  const today = challenge ? dayNumber(challenge.start_date) : 0;
  const todayDone = useMemo(
    () => checkIns.some((c) => c.date === todayIso() && c.completed),
    [checkIns]
  );
  const survivedCount = checkIns.filter((c) => c.completed).length;
  const hp = challenge ? Math.max(0, Math.min(100, Math.round((survivedCount / TOTAL_DAYS) * 100))) : 0;

  // Daily reminder scheduler (in-app)
  useEffect(() => {
    if (!challenge) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    let cancelled = false;

    const tick = () => {
      if (cancelled || !challenge) return;
      const [h, m] = challenge.reminder_time.split(":").map(Number);
      const now = new Date();
      if (now.getHours() === h && now.getMinutes() === m) {
        if (!todayDone) {
          new Notification("Only 66", { body: pickReminder(challenge.tone, today), tag: "only66-daily" });
        }
      }
    };
    const interval = setInterval(tick, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [challenge, todayDone, today]);

  // Auto-win
  useEffect(() => {
    if (!challenge || loading) return;
    if (survivedCount >= TOTAL_DAYS) {
      updateChallenge(challenge.id, { status: "completed" });
      navigate({ to: "/win" });
    }
  }, [survivedCount, challenge, loading, navigate]);

  // Detect today's check-in completing this session → trigger reveal animation
  useEffect(() => {
    if (loading) return;
    if (!hasInitializedRef.current) {
      prevTodayDoneRef.current = todayDone;
      hasInitializedRef.current = true;
      return;
    }
    if (todayDone && !prevTodayDoneRef.current) {
      setNewlyUnlockedDay(today);
      const t = setTimeout(() => setNewlyUnlockedDay(null), 2200);
      prevTodayDoneRef.current = true;
      return () => clearTimeout(t);
    }
    if (!todayDone) prevTodayDoneRef.current = false;
  }, [loading, todayDone, today]);

  if (loading || !challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground text-sm uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  const dayMap = new Map<number, LocalCheckIn>();
  checkIns.forEach((c) => dayMap.set(c.day_number, c));

  const displayDay = selectedDay ?? today;
  const selectedIsUnlocked =
    displayDay < today
      ? dayMap.get(displayDay)?.completed === true
      : displayDay === today
      ? todayDone
      : false;
  const isNewlyUnlocked = newlyUnlockedDay === displayDay;
  const displayName = localUser?.displayName?.trim() || null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl"><span className="text-primary">ONLY</span> 66</Link>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-sm border border-border px-3 py-2 text-xs font-display uppercase tracking-wider hover:bg-surface"
            >
              Settings
            </button>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* Status bar */}
        <section className="rounded-sm border border-border bg-surface p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                [ DAY {String(today).padStart(2, "0")} / 66 ]
              </div>
              <h1 className="mt-2 font-display text-4xl uppercase">{challenge.name}</h1>
              {challenge.motivation && (
                <p className="mt-2 text-sm text-muted-foreground max-w-md">"{challenge.motivation}"</p>
              )}
            </div>
            <div className="text-right">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Survived</div>
              <div className="font-display text-5xl text-primary">{survivedCount}</div>
            </div>
          </div>

          {/* Survival Meter */}
          <div className="mt-6">
            <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              <span>Survival Meter</span><span>{hp}%</span>
            </div>
            <div className="h-3 w-full rounded-sm border border-border bg-background overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${hp}%` }}
              />
            </div>
          </div>

          {/* Today's CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              disabled={todayDone || today < 1}
              onClick={() => setShowCheckIn(true)}
              className={`rounded-sm px-6 py-3 font-display text-lg uppercase tracking-wider ${
                todayDone
                  ? "bg-primary/30 border border-primary text-primary cursor-default"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {todayDone ? `Day ${today} survived` : `I survived day ${today}`}
            </button>
            <button
              onClick={() => setShowPanic(true)}
              className="rounded-sm border-2 border-primary text-primary px-6 py-3 font-display uppercase tracking-wider hover:bg-primary/10 animate-pulse-red"
            >
              I'm about to fold
            </button>
          </div>
        </section>

        {/* Welcome status line */}
        <div className="flex flex-col gap-0.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground/50">
            [ OPERATIVE STATUS ]
          </div>
          <div className="font-display text-xl uppercase tracking-wider text-foreground drop-shadow-[0_0_8px_oklch(0.62_0.24_25/0.45)]">
            {displayName
              ? <>THE RUN CONTINUES, <span className="text-primary">{displayName}</span>.</>
              : <>THE RUN CONTINUES.</>
            }
          </div>
        </div>

        {/* 66-day grid + Transmission card */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <section className="flex-1 min-w-0">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
              [ THE 66 ]
            </div>
            <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
              {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
                const c = dayMap.get(d);
                const isToday = d === today;
                const isPast = d < today;
                const survived = !!c?.completed;
                const violated = isPast && !survived;
                const isFinal = d === FINAL_DAY;
                const isMilestone = MILESTONES.has(d) && d !== FINAL_DAY;
                const isClickable = survived || isToday;
                const isSelected = d === displayDay;

                const base = "aspect-square rounded-sm border flex items-center justify-center font-mono text-[10px] sm:text-xs transition relative";
                let cls = "";
                if (survived && isFinal) {
                  cls = "bg-primary border-[color:var(--color-reward)] text-primary-foreground shadow-[0_0_18px_oklch(0.85_0.18_90/0.6)]";
                } else if (survived) {
                  cls = `bg-primary border-primary text-primary-foreground shadow-[0_0_10px_oklch(0.62_0.24_25/0.55)] ${isMilestone ? "ring-1 ring-[color:var(--color-reward)]" : ""}`;
                } else if (isToday) {
                  cls = "border-2 border-primary text-primary bg-primary/10 animate-pulse-red";
                } else if (violated) {
                  cls = "bg-[oklch(0.25_0.08_25)] border-[oklch(0.4_0.12_25)] text-[oklch(0.55_0.12_25)] line-through";
                } else if (isFinal) {
                  cls = "border-[color:var(--color-reward)]/70 text-[color:var(--color-reward)] bg-[color:var(--color-reward)]/5";
                } else if (isMilestone) {
                  cls = "border-[color:var(--color-reward)]/40 text-[color:var(--color-reward)]/70 bg-surface";
                } else {
                  cls = "border-border/40 bg-surface/40 text-muted-foreground/40";
                }

                return (
                  <div
                    key={d}
                    className={`${base} ${cls}${isClickable ? " cursor-pointer" : ""}${isSelected && isClickable ? " outline-2 outline-offset-1 outline-primary/60" : ""}`}
                    title={`Day ${d}${isFinal ? " — FINAL" : isMilestone ? " — milestone" : ""}`}
                    onClick={isClickable ? () => setSelectedDay(d) : undefined}
                  >
                    {survived ? (isFinal ? "★" : "✓") : d}
                  </div>
                );
              })}
            </div>
          </section>
          <TransmissionCard
            day={displayDay}
            isUnlocked={selectedIsUnlocked}
            isNewlyUnlocked={isNewlyUnlocked}
          />
        </div>

        {/* Stats inline */}
        <section className="grid grid-cols-3 gap-3">
          {[
            ["Streak", String(currentStreak(checkIns))],
            ["Best", String(bestStreak(checkIns))],
            ["Days left", String(Math.max(0, TOTAL_DAYS - today + 1))],
          ].map(([label, val]) => (
            <div key={label} className="rounded-sm border border-border bg-surface p-4">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
              <div className="mt-1 font-display text-3xl">{val}</div>
            </div>
          ))}
        </section>

        {/* Today's Protocol */}
        <section className="rounded-sm border-l-4 border-primary bg-surface p-6">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">
            [ TODAY'S PROTOCOL ]
          </div>
          <p className="font-display text-2xl uppercase leading-tight">
            {pickProtocol(challenge.tone, challenge.kind, challenge.name, today)}
          </p>
          {challenge.motivation && (
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Why: "{challenge.motivation}"
            </p>
          )}
        </section>
      </main>

      {showCheckIn && (
        <CheckInModal
          challenge={challenge}
          day={today}
          onClose={() => setShowCheckIn(false)}
          onDone={() => { setShowCheckIn(false); setSelectedDay(null); load(); }}
        />
      )}
      {showPanic && (
        <PanicModal
          challenge={challenge}
          day={today}
          message={PANIC_LINES[challenge.tone].replace("{day}", String(survivedCount))}
          onClose={() => setShowPanic(false)}
          onFold={fold}
        />
      )}
      {showSettings && (
        <SettingsSheet
          challenge={challenge}
          onClose={() => setShowSettings(false)}
          onChanged={load}
        />
      )}
    </div>
  );
}

function TransmissionCard({
  day,
  isUnlocked,
  isNewlyUnlocked,
}: {
  day: number;
  isUnlocked: boolean;
  isNewlyUnlocked: boolean;
}) {
  const quote = pickDailyQuote(day);
  return (
    <aside className="rounded-sm border-l-4 border-primary bg-surface p-5 shadow-[0_0_24px_oklch(0.62_0.24_25/0.15)] lg:w-72 xl:w-80 shrink-0">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
        [ DAY {String(day).padStart(2, "0")} TRANSMISSION. ]
      </div>
      {isUnlocked ? (
        <div className={isNewlyUnlocked ? "animate-quote-flicker" : ""}>
          <p className="text-lg leading-relaxed text-foreground">&ldquo;{quote.text}&rdquo;</p>
          <p className="mt-4 font-mono text-xs text-muted-foreground tracking-wide">— {quote.author}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-primary/30" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/50">locked</span>
            <div className="h-px flex-1 bg-primary/30" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60 pt-1">
            TRANSMISSION LOCKED
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Survive Day {day} to unlock.
          </p>
        </div>
      )}
    </aside>
  );
}

function currentStreak(cins: CheckIn[]) {
  const byDay = new Map(cins.map((c) => [c.day_number, c]));
  const maxDay = Math.max(0, ...cins.map((c) => c.day_number));
  let s = 0;
  for (let d = maxDay; d >= 1; d--) {
    if (byDay.get(d)?.completed) s++;
    else break;
  }
  return s;
}
function bestStreak(cins: CheckIn[]) {
  const days = cins.filter((c) => c.completed).map((c) => c.day_number).sort((a, b) => a - b);
  let best = 0, run = 0, prev = -1;
  for (const d of days) {
    if (d === prev + 1) run++; else run = 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}
