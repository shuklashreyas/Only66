import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getLatestAbandonedChallenge } from "@/lib/storage";
import { play } from "@/lib/sound";

export const Route = createFileRoute("/_authenticated/folded")({
  head: () => ({ meta: [{ title: "You folded — Only 66" }] }),
  beforeLoad: async () => {
    if (typeof window === "undefined") {
      return;
    }

    const challenge = getLatestAbandonedChallenge();
    if (!challenge) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: FoldedPage,
});

function FoldedPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("the habit");

  useEffect(() => {
    const challenge = getLatestAbandonedChallenge();
    if (!challenge) {
      navigate({ to: "/onboarding" });
      return;
    }

    setName(challenge.name);
    play("gameover");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <Link to="/" className="mx-auto max-w-3xl px-6 py-4 font-display text-2xl block">
          <span className="text-primary">ONLY</span> 66
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-4">
            [ STREAK BROKEN ]
          </div>
          <h1 className="font-display text-7xl uppercase">You folded.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            <span className="text-foreground font-semibold">{name}</span> beat you this round. The
            grid remembers. Start over if you want another shot at 66.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate({ to: "/onboarding" })}
              className="rounded-sm bg-primary px-6 py-3 font-display uppercase tracking-wider text-primary-foreground"
            >
              Start again
            </button>
            <Link
              to="/"
              className="rounded-sm border border-border px-6 py-3 font-display uppercase tracking-wider"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
