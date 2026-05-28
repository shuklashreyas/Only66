import { createFileRoute, Link } from "@tanstack/react-router";
import knightHero from "@/assets/knight-hero.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Only 66 — Pick one habit. Survive 66 days." },
      { name: "description", content: "A gamified 66-day habit tracker. Pick one habit, protect your streak, make it to Day 66." },
      { property: "og:title", content: "Only 66" },
      { property: "og:description", content: "Pick one habit. Survive 66 days." },
    ],
  }),
  component: Landing,
});

const EXAMPLES = [
  "No sugar",
  "Workout 20 min",
  "No scrolling after 10pm",
  "Read 10 pages",
  "No alcohol",
  "Cold shower",
  "Meditate 5 min",
  "No fast food",
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-display text-2xl">
            <span className="text-primary">ONLY</span>
            <span>66</span>
          </div>
          <Link
            to="/login"
            className="rounded-sm border border-border px-4 py-2 text-xs font-display uppercase tracking-wider hover:bg-surface"
          >
            Log in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-6">
              [ DAY 00 / 66 — INITIATE ]
            </div>
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.95] uppercase">
              Pick one habit.
              <br />
              <span className="text-primary">Survive 66 days.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground">
              Only 66 is a brutal little habit tracker. One challenge. One streak.
              Make it to Day 66. If you fold, the grid remembers.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {EXAMPLES.map((ex) => (
                <span
                  key={ex}
                  className="rounded-sm border border-border bg-surface px-3 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
                >
                  {ex}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 font-display text-lg uppercase tracking-wider text-primary-foreground hover:opacity-90"
              >
                Start your 66
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-sm border border-border px-8 py-4 font-display text-lg uppercase tracking-wider hover:bg-surface"
              >
                How it works
              </a>
            </div>
          </div>

          {/* Knight */}
          <div className="relative flex items-center justify-center md:justify-end">
            <div
              aria-hidden
              className="absolute inset-0 m-auto h-3/4 w-3/4 rounded-full bg-primary/30 blur-3xl animate-knight-glow"
            />
            <img
              src={knightHero}
              alt="Red and white knight standing guard over your 66-day streak"
              width={1024}
              height={1024}
              className="relative w-full max-w-[480px] drop-shadow-[0_0_40px_oklch(0.62_0.24_25/0.5)] animate-knight-float"
            />
          </div>
        </div>
      </section>


      {/* How it works */}
      <section id="how" className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-4xl uppercase">The protocol</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Pick one habit", d: "Build or break. One thing. No portfolio of half-attempts." },
              { n: "02", t: "Check in daily", d: "Every day you survive, you stamp the grid. Streak grows. HP holds." },
              { n: "03", t: "Don't fold", d: "Hit the panic button when you're about to break. Survive the urge. Repeat 66 times." },
            ].map((step) => (
              <div key={step.n} className="rounded-sm border border-border bg-background p-6">
                <div className="font-mono text-xs text-primary tracking-widest">{step.n}</div>
                <div className="mt-3 font-display text-2xl uppercase">{step.t}</div>
                <p className="mt-3 text-sm text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why 66 */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
            [ WHY 66 ]
          </div>
          <h2 className="font-display text-4xl uppercase">
            66 days is the average time
            <br />
            <span className="text-primary">a habit becomes automatic.</span>
          </h2>
          <p className="mt-6 text-muted-foreground">
            Not 21. Not 30. Sixty-six. We didn't make that up — researchers did.
            We just made it impossible to ignore.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/10">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="font-display text-5xl uppercase">Ready to enlist?</h2>
          <p className="mt-4 text-muted-foreground">One habit. 66 days. No refunds.</p>
          <Link
            to="/login"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 font-display text-lg uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            Start your 66
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Only 66 — Survive or restart.
        </div>
      </footer>
    </div>
  );
}
