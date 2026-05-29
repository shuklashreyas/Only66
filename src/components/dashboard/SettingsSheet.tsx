import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { syncReminderChallengeSnapshot } from "@/lib/api/push.functions";
import { enableBackgroundPush, getPushReminderState } from "@/lib/push";
import { THEMES, getStoredTheme, setStoredTheme, type AppTheme } from "@/lib/theme";
import { TONE_LABELS, type Tone } from "@/lib/tone";
import { updateChallenge, clearLocalUser, getLocalUser, getUserDisplayName, setUserDisplayName, type LocalChallenge } from "@/lib/storage";

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
  const [displayName, setDisplayName] = useState(getUserDisplayName() ?? "");
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme());
  const [pushSupported, setPushSupported] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const localUser = getLocalUser();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  useEffect(() => {
    void getPushReminderState()
      .then((state) => {
        setPushSupported(state.supported);
        setPushEnabled(state.subscribed);
      })
      .catch((error) => {
        console.error("Failed to inspect push state", error);
      });
  }, []);

  const syncChallengeReminderState = async (notificationEnabled: boolean, nextTone: Tone, nextReminderTime: string) => {
    if (!localUser) return;

    await syncReminderChallengeSnapshot({
      data: {
        localUserId: localUser.id,
        displayName: (displayName.trim() || getUserDisplayName()) ?? null,
        challenge: {
          localChallengeId: challenge.id,
          challengeName: challenge.name,
          tone: nextTone,
          startDate: challenge.start_date,
          reminderTime: nextReminderTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          status: challenge.status,
          notificationEnabled,
        },
      },
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const nextReminderTime = reminderTime + ":00";
      setUserDisplayName(displayName);
      setStoredTheme(theme);
      updateChallenge(challenge.id, { tone, reminder_time: nextReminderTime });
      await syncChallengeReminderState(pushEnabled, tone, nextReminderTime);
      toast.success("Saved.");
      onChanged();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
      setSaving(false);
    }
  };

  const enablePushReminders = async () => {
    if (!localUser) {
      toast.error("No local user found.");
      return;
    }

    setPushBusy(true);
    try {
      const state = await enableBackgroundPush(localUser.id);
      setPushSupported(state.supported);
      setPushEnabled(state.subscribed);

      if (!state.supported) {
        toast.error("Push notifications are not supported in this browser.");
        return;
      }

      if (state.permission !== "granted") {
        toast.error("Notification permission was not granted.");
        return;
      }

      await syncChallengeReminderState(true, tone, reminderTime + ":00");
      toast.success("Background push reminders enabled.");
    } catch (error: any) {
      toast.error(error.message || "Could not enable background push reminders.");
    } finally {
      setPushBusy(false);
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

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Display name</div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should we call you?"
              maxLength={50}
              className="w-full rounded-sm border border-border bg-background px-3 py-2 font-mono"
            />
          </div>

          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">THEME</div>
            <div className="grid gap-2">
              {THEMES.map((themeOption) => {
                const selected = themeOption.id === theme;
                return (
                  <button
                    key={themeOption.id}
                    onClick={() => setTheme(themeOption.id)}
                    className={`w-full rounded-sm border px-3 py-2 text-left bg-background transition ${
                      selected
                        ? "border-primary shadow-[0_0_14px_color-mix(in_srgb,var(--primary)_35%,transparent)]"
                        : "border-border hover:bg-surface-2"
                    }`}
                  >
                    <div className="font-mono text-xs uppercase tracking-widest text-foreground">{themeOption.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{themeOption.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={enablePushReminders}
              disabled={pushBusy || !pushSupported}
              className={`w-full rounded-sm border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest transition disabled:opacity-50 ${
                pushEnabled ? "border-primary text-primary shadow-[0_0_14px_color-mix(in_srgb,var(--primary)_35%,transparent)]" : "border-border hover:bg-surface-2"
              }`}
            >
              {pushBusy
                ? "Connecting push..."
                : pushEnabled
                ? "Background push connected"
                : "Enable background push reminders"}
            </button>
            <button
              disabled
              className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest opacity-40 cursor-not-allowed"
            >
              SMS reminders — coming soon
            </button>
            <p className="text-xs font-mono text-muted-foreground">
              {pushSupported
                ? pushEnabled
                  ? "Service worker + Push API are active for this browser."
                  : "Push reminders work even when the tab is closed once connected."
                : "This browser does not support background push reminders."}
            </p>
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
