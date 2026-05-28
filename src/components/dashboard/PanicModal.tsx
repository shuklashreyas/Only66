import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { play, startTick, stopTick } from "@/lib/sound";

type Challenge = { id: string; user_id: string; motivation: string | null };

export function PanicModal({
  challenge,
  day,
  message,
  onClose,
}: {
  challenge: Challenge;
  day: number;
  message: string;
  onClose: () => void;
}) {
  const [seconds, setSeconds] = useState(60);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    if (!logged) {
      supabase.from("panic_events").insert({
        challenge_id: challenge.id,
        user_id: challenge.user_id,
      }).then(() => setLogged(true));
    }
  }, [challenge, logged]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const survived = async () => {
    await supabase
      .from("panic_events")
      .update({ resolved: true })
      .eq("challenge_id", challenge.id)
      .eq("resolved", false);
    toast.success("You held the line.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-sm border-2 border-primary bg-background p-8 animate-slide-up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3 animate-pulse">
          [ PANIC PROTOCOL ENGAGED ]
        </div>
        <h2 className="font-display text-4xl uppercase">Hold the line.</h2>
        <p className="mt-4 text-muted-foreground">{message}</p>

        {challenge.motivation && (
          <div className="mt-6 rounded-sm border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Why you started
            </div>
            <p className="text-sm">"{challenge.motivation}"</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="font-display text-7xl text-primary">{seconds}</div>
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1">
            seconds remaining
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <button
            disabled={seconds > 0}
            onClick={survived}
            className={`rounded-sm px-4 py-3 font-display uppercase tracking-wider transition ${
              seconds > 0
                ? "bg-surface-2 text-muted-foreground border border-border cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-[0_0_24px_oklch(0.62_0.24_25/0.6)]"
            }`}
          >
            {seconds > 0 ? `WAIT ${seconds}S` : "I'm staying in"}
          </button>
          <button
            onClick={onClose}
            className="rounded-sm border border-border px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-surface"
          >
            I'm folding
          </button>
        </div>
      </div>
    </div>
  );
}
