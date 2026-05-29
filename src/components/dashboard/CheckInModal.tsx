import { useEffect, useState } from "react";
import { toast } from "sonner";
import { todayIso } from "@/lib/day-math";
import { syncReminderCheckInSnapshot } from "@/lib/api/push.functions";
import { play } from "@/lib/sound";
import { createCheckIn, getLocalUser, type LocalChallenge } from "@/lib/storage";

export function CheckInModal({
  challenge,
  day,
  onClose,
  onDone,
}: {
  challenge: LocalChallenge;
  day: number;
  onClose: () => void;
  onDone: () => void;
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
      createCheckIn({
        challenge_id: challenge.id,
        day_number: day,
        date: todayIso(),
        completed: true,
        difficulty,
        almost_folded: almostFolded,
        notes: notes.trim() || null,
      });

      const localUser = getLocalUser();
      if (localUser) {
        await syncReminderCheckInSnapshot({
          data: {
            localUserId: localUser.id,
            localChallengeId: challenge.id,
            date: todayIso(),
            dayNumber: day,
            completed: true,
          },
        }).catch((error) => {
          console.error("Failed to mirror reminder check-in", error);
        });
      }

      play("stamp");
      toast.success(`Day ${day} survived.`);
      onDone();
    } catch (err: any) {
      toast.error(err.message || "Could not save");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md rounded-sm border border-border bg-surface p-6 animate-slide-up">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-(--color-success) mb-3">
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
              className="w-full accent-(--color-primary)"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={almostFolded}
              onChange={(e) => setAlmostFolded(e.target.checked)}
              className="size-5 accent-(--color-primary)"
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
            className="flex-1 rounded-sm bg-(--color-success) text-background px-4 py-3 font-display uppercase tracking-wider text-sm disabled:opacity-50"
          >
            {submitting ? "..." : "Stamp it"}
          </button>
        </div>
      </div>
    </div>
  );
}
