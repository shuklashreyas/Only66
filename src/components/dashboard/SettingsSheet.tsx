import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getReminderPushDebug, sendTestPushNotification, syncReminderChallengeSnapshot } from "@/lib/api/push.functions";
import { enableBackgroundPush, getPushReminderState, type PushReminderState } from "@/lib/push";
import { THEMES, getStoredTheme, setStoredTheme, type AppTheme } from "@/lib/theme";
import { TONE_LABELS, type Tone } from "@/lib/tone";
import { updateChallenge, clearLocalUser, getLocalUser, getUserDisplayName, setUserDisplayName, type LocalChallenge } from "@/lib/storage";

type NotificationStatusKey =
  | "push_connected"
  | "notifications_not_enabled"
  | "permission_denied"
  | "unsupported_browser"
  | "subscription_failed"
  | "reminder_synced"
  | "reminder_sync_failed";

const NOTIFICATION_STATUS_LABELS: Record<NotificationStatusKey, string> = {
  push_connected: "Push connected",
  notifications_not_enabled: "Notifications not enabled",
  permission_denied: "Permission denied",
  unsupported_browser: "Unsupported browser",
  subscription_failed: "Subscription failed",
  reminder_synced: "Reminder synced",
  reminder_sync_failed: "Reminder sync failed",
};

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
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">("default");
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false);
  const [subscriptionEndpoint, setSubscriptionEndpoint] = useState<string | null>(null);
  const [reminderSynced, setReminderSynced] = useState(false);
  const [debugTimezone, setDebugTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [lastPushSentDate, setLastPushSentDate] = useState<string | null>(null);
  const [lastSubscriptionError, setLastSubscriptionError] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatusKey>("notifications_not_enabled");
  const [notificationStatusDetail, setNotificationStatusDetail] = useState<string>("");
  const [pushBusy, setPushBusy] = useState(false);
  const [testingPush, setTestingPush] = useState(false);
  const [saving, setSaving] = useState(false);
  const localUser = getLocalUser();

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const setStatus = (status: NotificationStatusKey, detail = "") => {
    setNotificationStatus(status);
    setNotificationStatusDetail(detail);
  };

  const applyBrowserState = (state: PushReminderState) => {
    setPushSupported(state.supported);
    setPushEnabled(state.subscribed);
    setPushPermission(state.permission);
    setServiceWorkerRegistered(state.serviceWorkerRegistered);
    setSubscriptionEndpoint(state.endpoint);

    if (!state.supported) {
      setStatus("unsupported_browser", "This browser does not support Push API or service workers.");
      return;
    }
    if (state.permission === "denied") {
      setStatus("permission_denied", "Browser notification permission is denied.");
      return;
    }
    if (state.subscribed) {
      setStatus(reminderSynced ? "reminder_synced" : "push_connected");
      return;
    }
    setStatus("notifications_not_enabled", "Enable push reminders to receive notifications after the tab closes.");
  };

  const refreshDebugState = async () => {
    if (!localUser) return;

    try {
      const debug = await getReminderPushDebug({
        data: {
          localUserId: localUser.id,
          localChallengeId: challenge.id,
        },
      });

      setReminderSynced(debug.reminderSynced);
      setDebugTimezone(debug.timezone ?? debugTimezone);
      setLastPushSentDate(debug.lastNotificationSentOn);
      setLastSubscriptionError(debug.lastSubscriptionError);

      if (debug.reminderSynced && pushEnabled) {
        setStatus("reminder_synced", "Reminder mirror is saved in Supabase and ready for cron delivery.");
      }
    } catch (error) {
      console.error("Failed to load reminder debug state", error);
      setReminderSynced(false);
    }
  };

  const refreshPushState = async () => {
    try {
      const state = await getPushReminderState();
      applyBrowserState(state);
      await refreshDebugState();
    } catch (error) {
      console.error("Failed to inspect push state", error);
      setStatus("subscription_failed", "Could not inspect the current push subscription.");
    }
  };

  useEffect(() => {
    void refreshPushState();
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

    setReminderSynced(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const nextReminderTime = reminderTime + ":00";
      setUserDisplayName(displayName);
      setStoredTheme(theme);
      updateChallenge(challenge.id, { tone, reminder_time: nextReminderTime });
      await syncChallengeReminderState(pushEnabled, tone, nextReminderTime);
      setStatus("reminder_synced", "Reminder mirror updated in Supabase.");
      toast.success("Saved.");
      onChanged();
      onClose();
    } catch (err: any) {
      setStatus("reminder_sync_failed", err.message || "Could not sync reminder state to Supabase.");
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
      applyBrowserState(state);

      if (!state.supported) {
        setStatus("unsupported_browser", "Push API and service workers are not supported here.");
        toast.error("Push notifications are not supported in this browser.");
        return;
      }

      if (state.permission !== "granted") {
        setStatus("permission_denied", "Grant notification permission in your browser settings to use push reminders.");
        toast.error("Notification permission was not granted.");
        return;
      }

      await syncChallengeReminderState(true, tone, reminderTime + ":00");
      setStatus("reminder_synced", "Push subscription saved and reminder mirror synced.");
      toast.success("Background push reminders enabled.");
    } catch (error: any) {
      setStatus("subscription_failed", error.message || "Push subscription could not be created or synced.");
      toast.error(error.message || "Could not enable background push reminders.");
    } finally {
      setPushBusy(false);
    }
  };

  const sendTestNotification = async () => {
    if (!localUser) {
      toast.error("No local user found.");
      return;
    }

    setTestingPush(true);
    try {
      await sendTestPushNotification({
        data: {
          localUserId: localUser.id,
          localChallengeId: challenge.id,
        },
      });
      setStatus("push_connected", "Test push sent through the backend delivery path.");
      toast.success("Test push sent.");
      await refreshDebugState();
    } catch (error: any) {
      setStatus("subscription_failed", error.message || "Backend test push failed.");
      toast.error(error.message || "Could not send test push.");
    } finally {
      setTestingPush(false);
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
            <div className="rounded-sm border border-border bg-background px-3 py-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Notification status</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-widest text-primary">
                {NOTIFICATION_STATUS_LABELS[notificationStatus]}
              </div>
              {notificationStatusDetail && (
                <p className="mt-2 text-xs text-muted-foreground">{notificationStatusDetail}</p>
              )}
            </div>
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
              onClick={sendTestNotification}
              disabled={testingPush || !pushEnabled}
              className="w-full rounded-sm border border-border bg-background px-3 py-2 text-sm font-mono uppercase tracking-widest transition hover:bg-surface-2 disabled:opacity-50"
            >
              {testingPush ? "Sending test push..." : "Send test notification"}
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

          {import.meta.env.DEV && (
            <div className="rounded-sm border border-border bg-background p-4 space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Push debug</div>
              <div className="grid gap-1 text-xs font-mono text-muted-foreground">
                <div>Notification permission: <span className="text-foreground">{pushPermission}</span></div>
                <div>Service worker registered: <span className="text-foreground">{serviceWorkerRegistered ? "yes" : "no"}</span></div>
                <div>Push subscription exists: <span className="text-foreground">{subscriptionEndpoint ? "yes" : "no"}</span></div>
                <div>Reminder synced to Supabase: <span className="text-foreground">{reminderSynced ? "yes" : "no"}</span></div>
                <div>Reminder time: <span className="text-foreground">{reminderTime}</span></div>
                <div>Timezone: <span className="text-foreground">{debugTimezone}</span></div>
                <div>Last push sent date: <span className="text-foreground">{lastPushSentDate ?? "none"}</span></div>
                <div>Last subscription error: <span className="text-foreground">{lastSubscriptionError ?? "none"}</span></div>
              </div>
            </div>
          )}

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
