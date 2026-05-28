import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { TONE_LABELS, type Tone } from "@/lib/tone";
import { updateChallenge, deleteChallenge, clearLocalUser, type LocalChallenge } from "@/lib/storage";

export function SettingsSheet({
  challenge,
  onClose,
  onChanged,
}: {
  challenge: LocalChallenge;
  onClose: () => void;
  onChanged: () => void;
}) {
  const navigate = useNavigate();
  const [tone, setTone] = useState<Tone>(challenge.tone);
  const [reminderTime, setReminderTime] = useState(challenge.reminder_time.slice(0, 5));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const save = () => {
    setSaving(true);
    try {
      updateChallenge(challenge.id, { tone, reminder_time: reminderTime + ":00" });
      toast.success("Saved.");
      onChanged();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
      setSaving(false);
    }
  };

  const abandon = () => {
    if (!confirm("Abandon this challenge? Your streak ends here.")) return;
    updateChallenge(challenge.id, { status: "abandoned" });
    toast("Challenge abandoned.");
    navigate({ to: "/folded" });
  };

  const signOut = () => {
    clearLocalUser();
    navigate({ to: "/" });
  };

  const requestNotifs = async () => {
    if (typeof Notification === "undefined") return toast.error("Not supported");
    const res = await Notification.requestPermission();
    if (res === "granted") toast.success("Notifications on.");
    else toast.error("Permission denied.");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
      <div className="h-full w-full max-w-md bg-surface border-l border-border overflow-y-auto animate-slide-up">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-2xl uppercase">Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground font-mono text-xs uppercase">Close</button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Challenge</div>
            <div className="font-display text-xl">{challenge.name}</div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Tone</div>
            <div className="grid gap-2">
              {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-sm border px-3 py-2 text-left text-sm ${
                    tone === t ? "border-primary bg-primary/10" : "border-border bg-background"
                  }`}
                >
                  {TONE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Reminder time</div>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="rounded-sm border border-border bg-background px-3 py-2 font-mono"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={requestNotifs}
              className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest hover:bg-surface-2"
            >
              Enable browser notifications
            </button>
            <button
              disabled
              className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest opacity-40 cursor-not-allowed"
            >
              SMS reminders — coming soon
            </button>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-sm bg-primary text-primary-foreground px-4 py-3 font-display uppercase tracking-wider disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <div className="pt-6 border-t border-border space-y-2">
            <button
              onClick={abandon}
              className="w-full rounded-sm border border-primary text-primary px-4 py-2 text-sm font-display uppercase tracking-wider hover:bg-primary/10"
            >
              Abandon challenge
            </button>
            <button
              onClick={signOut}
              className="w-full rounded-sm border border-border px-4 py-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:bg-background"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
