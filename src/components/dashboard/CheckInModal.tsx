import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { todayIso } from "@/lib/day-math";
import { play } from "@/lib/sound";

type Challenge = { id: string; user_id: string; name: string };

export function CheckInModal({
  challenge,
  day,
  onClose,
  onDone,
}: {
  challenge: Challenge;
  day: number;
  onClose: () => void;
  onDone: () => void | Promise<void>;
}) {
  const [difficulty, setDifficulty] = useState(3);
  const [almostFolded, setAlmostFolded] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("check_ins").insert({
        challenge_id: challenge.id,
        user_id: challenge.user_id,
        day_number: day,
        date: todayIso(),
        completed: true,
        difficulty,
        almost_folded: almostFolded,
        notes: notes.trim() || null,
      });
      if (error) throw error;
      play("stamp");
      toast.success(`Day ${day} survived.`);
      await onDone();
    } catch (err: any) {
      toast.error(err.message || "Could not save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md rounded-sm border border-border bg-surface p-6 animate-slide-up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--color-success)] mb-3">
          [ DAY {day} — STAMP ]
        </div>
        <h2 className="font-display text-3xl uppercase">Survived?</h2>

        <div className="mt-6 space-y-5">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
              How hard? ({difficulty}/5)
            </div>
            <input
              type="range" min={1} max={5} value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full accent-[color:var(--color-primary)]"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={almostFolded}
              onChange={(e) => setAlmostFolded(e.target.checked)}
              className="size-5 accent-[color:var(--color-primary)]"
            />
            <span className="text-sm">Almost folded</span>
          </label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            maxLength={280}
            placeholder="Notes (optional)"
            className="w-full rounded-sm border border-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-sm border border-border px-4 py-3 font-display uppercase tracking-wider text-sm"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={submit}
            className="flex-1 rounded-sm bg-[color:var(--color-success)] text-background px-4 py-3 font-display uppercase tracking-wider text-sm disabled:opacity-50"
          >
            {submitting ? "..." : "Stamp it"}
          </button>
        </div>
      </div>
    </div>
  );
}
