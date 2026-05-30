// "The 66-Day Wall" — perspective survival grid as the landing hero visual.
// 11 cols × 6 rows = 66 cells. Day 1 glows red (active), Day 66 glows gold
// (final boss), all others fade into low-opacity future tiles.

const COLS = 11;
const ROWS = 6;
const TOTAL = COLS * ROWS;

export function WallHero() {
  return (
    <div
      aria-label="The 66-Day Wall: a perspective grid of 66 survival cells. Day 1 glows red, Day 66 glows gold."
      role="img"
      className="relative isolate flex items-center justify-center md:justify-end h-[420px] md:h-[520px] select-none"
    >
      {/* Ambient red glow behind the wall */}
      <div
        aria-hidden
        className="absolute inset-0 m-auto h-[70%] w-[80%] rounded-[40%] bg-primary/25 blur-3xl animate-wall-glow"
      />
      {/* Far-end gold halo for Day 66 */}
      <div
        aria-hidden
        className="absolute right-[6%] top-[28%] h-40 w-40 rounded-full bg-[color:var(--color-reward)]/30 blur-3xl"
      />
      {/* Faint scan lines */}
      <div aria-hidden className="absolute inset-0 wall-scanlines opacity-40 pointer-events-none" />

      {/* The grid in 3D perspective */}
      <div className="relative w-full max-w-[560px] aspect-[11/7] wall-perspective" aria-hidden>
        <div className="wall-tilt absolute inset-0">
          <div
            className="grid h-full w-full gap-[6px]"
            style={{
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: TOTAL }, (_, i) => {
              const day = i + 1;
              const isStart = day === 1;
              const isFinal = day === TOTAL;
              const isMilestone = day === 22 || day === 44;

              let cls = "border border-border/40 bg-surface/30 text-muted-foreground/40";
              let label: string | null = null;

              if (isStart) {
                cls =
                  "border border-primary bg-primary/80 text-primary-foreground shadow-[0_0_18px_oklch(0.62_0.24_25/0.75)] animate-pulse-red";
                label = "01";
              } else if (isFinal) {
                cls =
                  "border-2 border-[color:var(--color-reward)] bg-[color:var(--color-reward)]/30 text-[color:var(--color-reward)] shadow-[0_0_22px_oklch(0.85_0.18_90/0.7)]";
                label = "★";
              } else if (isMilestone) {
                cls =
                  "border border-[color:var(--color-reward)]/40 bg-surface/60 text-[color:var(--color-reward)]/70";
              }

              return (
                <div
                  key={day}
                  className={`rounded-[2px] flex items-center justify-center font-mono text-[9px] tracking-widest ${cls}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tiny HUD labels */}
      <div className="absolute left-2 bottom-2 font-mono text-[10px] uppercase tracking-[0.3em] text-primary/80">
        [ DAY 01 — START ]
      </div>
      <div className="absolute right-2 top-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-reward)]/80">
        [ DAY 66 — FINAL ]
      </div>
    </div>
  );
}
