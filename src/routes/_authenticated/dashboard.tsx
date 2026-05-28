import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TOTAL_DAYS, dayNumber, todayIso } from "@/lib/day-math";
import { pickReminder, pickProtocol, PANIC_LINES, MILESTONES, FINAL_DAY, type Tone } from "@/lib/tone";
import { CheckInModal } from "@/components/dashboard/CheckInModal";
import { PanicModal } from "@/components/dashboard/PanicModal";
import { SettingsSheet } from "@/components/dashboard/SettingsSheet";

type Challenge = {
  id: string;
  user_id: string;
  name: string;
  kind: "build" | "quit";
  motivation: string | null;
  tone: Tone;
  start_date: string;
  reminder_time: string;
  status: "active" | "completed" | "abandoned";
};

type CheckIn = {
  id: string;
  day_number: number;
  date: string;
  completed: boolean;
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Only 66" }] }),
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data } = await supabase
      .from("challenges")
      .select("id, status")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) throw redirect({ to: "/onboarding" });
    if (data.status === "completed") throw redirect({ to: "/win" });
  },
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const load = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data: ch } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!ch) { navigate({ to: "/onboarding" }); return; }
    setChallenge(ch as Challenge);
    const { data: cins } = await supabase
      .from("check_ins")
      .select("id, day_number, date, completed")
      .eq("challenge_id", ch.id)
      .order("day_number");
    setCheckIns((cins as CheckIn[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

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
      supabase.from("challenges").update({ status: "completed" }).eq("id", challenge.id).then(() => {
        navigate({ to: "/win" });
      });
    }
  }, [survivedCount, challenge, loading, navigate]);

  if (loading || !challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono text-muted-foreground text-sm uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  const dayMap = new Map<number, CheckIn>();
  checkIns.forEach((c) => dayMap.set(c.day_number, c));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl"><span className="text-primary">ONLY</span> 66</Link>
          <button
            onClick={() => setShowSettings(true)}
            className="rounded-sm border border-border px-3 py-2 text-xs font-display uppercase tracking-wider hover:bg-surface"
          >
            Settings
          </button>
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
              <div className="font-display text-5xl text-[color:var(--color-success)]">{survivedCount}</div>
            </div>
          </div>

          {/* HP bar */}
          <div className="mt-6">
            <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              <span>HP</span><span>{hp}%</span>
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
                  ? "bg-[color:var(--color-success)] text-background cursor-default"
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

        {/* 66-day grid */}
        <section>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            [ THE 66 ]
          </div>
          <div className="grid grid-cols-11 gap-1.5 sm:gap-2">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
              const c = dayMap.get(d);
              const isToday = d === today;
              const isPast = d < today;
              const survived = c?.completed;
              return (
                <div
                  key={d}
                  className={`aspect-square rounded-sm border flex items-center justify-center font-mono text-[10px] sm:text-xs transition ${
                    survived
                      ? "bg-[color:var(--color-success)] border-[color:var(--color-success)] text-background"
                      : isPast
                      ? "bg-surface border-border/40 text-muted-foreground/40 line-through"
                      : isToday
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                  title={`Day ${d}`}
                >
                  {survived ? "✓" : d}
                </div>
              );
            })}
          </div>
        </section>

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
      </main>

      {showCheckIn && (
        <CheckInModal
          challenge={challenge}
          day={today}
          onClose={() => setShowCheckIn(false)}
          onDone={async () => { setShowCheckIn(false); await load(); }}
        />
      )}
      {showPanic && (
        <PanicModal
          challenge={challenge}
          day={today}
          message={PANIC_LINES[challenge.tone].replace("{day}", String(survivedCount))}
          onClose={() => setShowPanic(false)}
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
