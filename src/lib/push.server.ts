import webpush from "web-push";

import type { Database } from "@/integrations/supabase/types";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { TOTAL_DAYS } from "@/lib/day-math";
import { TONE_LABELS, pickPushReminder } from "@/lib/tone";

type ReminderChallengeRow = Database["public"]["Tables"]["reminder_challenges"]["Row"];
type PushSubscriptionRow = Database["public"]["Tables"]["push_subscriptions"]["Row"];
type NotificationLogRow = Database["public"]["Tables"]["notification_logs"]["Row"];

type ReminderChallengeSnapshot = {
  localUserId: string;
  displayName: string | null;
  challenge: {
    localChallengeId: string;
    challengeName: string;
    tone: Database["public"]["Enums"]["challenge_tone"];
    startDate: string;
    reminderTime: string;
    timezone: string;
    status: Database["public"]["Enums"]["challenge_status"];
    notificationEnabled: boolean;
  };
};

type ReminderCheckInSnapshot = {
  localUserId: string;
  localChallengeId: string;
  date: string;
  dayNumber: number;
  completed: boolean;
};

type PushSubscriptionSnapshot = {
  localUserId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

let vapidConfigured = false;
let cronSecretWarningLogged = false;

function ensureWebPushConfigured() {
  if (vapidConfigured) return;

  const publicKey = process.env.VITE_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:hello@only66.app";

  if (!publicKey || !privateKey) {
    throw new Error("Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY environment variables.");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
}

export async function upsertReminderChallengeSnapshot(input: ReminderChallengeSnapshot) {
  const { error } = await supabaseAdmin.from("reminder_challenges").upsert(
    {
      local_challenge_id: input.challenge.localChallengeId,
      local_user_id: input.localUserId,
      display_name: input.displayName,
      challenge_name: input.challenge.challengeName,
      tone: input.challenge.tone,
      start_date: input.challenge.startDate,
      reminder_time: input.challenge.reminderTime,
      timezone: input.challenge.timezone,
      status: input.challenge.status,
      notification_enabled: input.challenge.notificationEnabled,
    },
    { onConflict: "local_challenge_id" },
  );

  if (error) throw error;
}

export async function upsertReminderCheckInSnapshot(input: ReminderCheckInSnapshot) {
  const { error } = await supabaseAdmin.from("reminder_check_ins").upsert(
    {
      local_challenge_id: input.localChallengeId,
      local_user_id: input.localUserId,
      date: input.date,
      day_number: input.dayNumber,
      completed: input.completed,
    },
    { onConflict: "local_challenge_id,date" },
  );

  if (error) throw error;
}

export async function upsertPushSubscriptionSnapshot(input: PushSubscriptionSnapshot) {
  const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
    {
      local_user_id: input.localUserId,
      endpoint: input.endpoint,
      p256dh: input.p256dh,
      auth: input.auth,
      active: true,
      last_error: null,
    },
    { onConflict: "endpoint" },
  );

  if (error) throw error;
}

export async function deactivatePushSubscription(endpoint: string, lastError?: string) {
  const { error } = await supabaseAdmin
    .from("push_subscriptions")
    .update({ active: false, last_error: lastError ?? null })
    .eq("endpoint", endpoint);

  if (error) throw error;
}

function getLocalDateTime(timezone: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const lookup = new Map(parts.map((part) => [part.type, part.value]));
  const date = `${lookup.get("year")}-${lookup.get("month")}-${lookup.get("day")}`;
  const time = `${lookup.get("hour")}:${lookup.get("minute")}`;

  return { date, time };
}

function dayNumberForLocalDate(startDate: string, localDate: string) {
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [currentYear, currentMonth, currentDay] = localDate.split("-").map(Number);

  const startUtc = Date.UTC(startYear, startMonth - 1, startDay);
  const currentUtc = Date.UTC(currentYear, currentMonth - 1, currentDay);
  const diffDays = Math.floor((currentUtc - startUtc) / 86400000);
  return diffDays + 1;
}

async function loadSubscriptions(localUserId: string) {
  const { data, error } = await supabaseAdmin
    .from("push_subscriptions")
    .select("*")
    .eq("local_user_id", localUserId)
    .eq("active", true);

  if (error) throw error;
  return (data ?? []) as PushSubscriptionRow[];
}

async function challengeHasCheckIn(localChallengeId: string, date: string) {
  const { data, error } = await supabaseAdmin
    .from("reminder_check_ins")
    .select("local_challenge_id")
    .eq("local_challenge_id", localChallengeId)
    .eq("date", date)
    .eq("completed", true)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

async function markNotificationSent(localChallengeId: string, date: string) {
  const { error } = await supabaseAdmin
    .from("reminder_challenges")
    .update({ last_notification_sent_on: date })
    .eq("local_challenge_id", localChallengeId);

  if (error) throw error;
}

async function reserveNotificationLog(localUserId: string, localChallengeId: string, date: string, kind: string) {
  // The unique constraint on (challenge, date, kind) is our cross-cron dedupe lock.
  const { data, error } = await supabaseAdmin
    .from("notification_logs")
    .insert({
      local_user_id: localUserId,
      local_challenge_id: localChallengeId,
      date,
      kind,
      status: "pending",
    })
    .select("id")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") return null;
    throw error;
  }

  return data?.id ?? null;
}

async function updateNotificationLog(id: string, updates: Partial<NotificationLogRow>) {
  const { error } = await supabaseAdmin
    .from("notification_logs")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

async function sendPushPayload(
  subscriptions: PushSubscriptionRow[],
  payload: string,
) {
  ensureWebPushConfigured();

  let sent = 0;
  let deactivated = 0;

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payload,
      );
      sent += 1;
    } catch (error: any) {
      const statusCode = error?.statusCode;
      if (statusCode === 404 || statusCode === 410) {
        await deactivatePushSubscription(subscription.endpoint, `${statusCode}`);
        deactivated += 1;
        continue;
      }

      await deactivatePushSubscription(subscription.endpoint, error?.message ?? "push send failed");
      deactivated += 1;
    }
  }

  return { sent, deactivated };
}

async function sendChallengePush(challenge: ReminderChallengeRow, subscriptions: PushSubscriptionRow[], localDate: string) {
  const dayNumber = dayNumberForLocalDate(challenge.start_date, localDate);
  if (dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    return { sent: 0, deactivated: 0, dayNumber };
  }

  const logId = await reserveNotificationLog(challenge.local_user_id, challenge.local_challenge_id, localDate, "daily-reminder");
  if (!logId) {
    return { sent: 0, deactivated: 0, dayNumber, duplicateSuppressed: true };
  }

  const payload = JSON.stringify({
    title: "Only66",
    body: pickPushReminder(challenge.tone, dayNumber),
    url: "/dashboard",
    tag: `only66-reminder-${challenge.local_challenge_id}-${localDate}`,
  });

  const { sent, deactivated } = await sendPushPayload(subscriptions, payload);

  if (sent > 0) {
    await markNotificationSent(challenge.local_challenge_id, localDate);
    await updateNotificationLog(logId, {
      status: "sent",
      sent_at: new Date().toISOString(),
      message: payload,
    });
  } else {
    await updateNotificationLog(logId, {
      status: "failed",
      message: "No push notifications were delivered.",
    });
  }

  return { sent, deactivated, dayNumber, duplicateSuppressed: false };
}

export async function getReminderDebugStatus(localUserId: string, localChallengeId: string) {
  const [{ data: challenge, error: challengeError }, { data: subscriptions, error: subscriptionsError }] = await Promise.all([
    supabaseAdmin
      .from("reminder_challenges")
      .select("local_challenge_id, notification_enabled, reminder_time, timezone, last_notification_sent_on, status")
      .eq("local_user_id", localUserId)
      .eq("local_challenge_id", localChallengeId)
      .maybeSingle(),
    supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, active, last_error")
      .eq("local_user_id", localUserId),
  ]);

  if (challengeError) throw challengeError;
  if (subscriptionsError) throw subscriptionsError;

  const activeSubscriptions = (subscriptions ?? []).filter((subscription) => subscription.active);
  const lastErroredSubscription = [...(subscriptions ?? [])].reverse().find((subscription) => subscription.last_error);

  return {
    reminderSynced: Boolean(challenge),
    reminderTime: challenge?.reminder_time ?? null,
    timezone: challenge?.timezone ?? null,
    notificationEnabled: challenge?.notification_enabled ?? false,
    lastNotificationSentOn: challenge?.last_notification_sent_on ?? null,
    status: challenge?.status ?? null,
    activeSubscriptionCount: activeSubscriptions.length,
    lastSubscriptionError: lastErroredSubscription?.last_error ?? null,
  };
}

export async function sendTestPush(localUserId: string, localChallengeId: string) {
  const { data: challenge, error } = await supabaseAdmin
    .from("reminder_challenges")
    .select("*")
    .eq("local_user_id", localUserId)
    .eq("local_challenge_id", localChallengeId)
    .maybeSingle();

  if (error) throw error;
  if (!challenge) {
    throw new Error("Reminder mirror not found. Save settings or enable push first.");
  }

  const subscriptions = await loadSubscriptions(localUserId);
  if (subscriptions.length === 0) {
    throw new Error("No active push subscription found.");
  }

  const dayNumber = dayNumberForLocalDate(challenge.start_date, getLocalDateTime(challenge.timezone, new Date()).date);
  const payload = JSON.stringify({
    title: "Only66",
    body: `[TEST] ${TONE_LABELS[challenge.tone]} push live for Day ${Math.max(1, dayNumber)}/66.`,
    url: "/dashboard",
    tag: `only66-test-${challenge.local_challenge_id}`,
  });

  const result = await sendPushPayload(subscriptions, payload);
  if (result.sent === 0) {
    throw new Error("Push send failed. Check subscription and VAPID configuration.");
  }

  return result;
}

export function logMissingCronSecretWarning() {
  if (cronSecretWarningLogged) return;
  cronSecretWarningLogged = true;
  console.warn("[push] CRON_SECRET is not set. /api/push/cron is accessible without shared-secret auth.");
}

export async function runReminderSweep(now = new Date()) {
  const { data, error } = await supabaseAdmin
    .from("reminder_challenges")
    .select("*")
    .eq("status", "active")
    .eq("notification_enabled", true);

  if (error) throw error;

  const challenges = (data ?? []) as ReminderChallengeRow[];
  let checked = 0;
  let matched = 0;
  let sent = 0;
  let skippedCheckedIn = 0;
  let skippedAlreadySent = 0;
  let deactivated = 0;

  for (const challenge of challenges) {
    checked += 1;
    const localNow = getLocalDateTime(challenge.timezone, now);
    if (challenge.reminder_time.slice(0, 5) !== localNow.time) {
      continue;
    }

    matched += 1;

    if (challenge.last_notification_sent_on === localNow.date) {
      skippedAlreadySent += 1;
      continue;
    }

    const hasCheckIn = await challengeHasCheckIn(challenge.local_challenge_id, localNow.date);
    if (hasCheckIn) {
      skippedCheckedIn += 1;
      continue;
    }

    const subscriptions = await loadSubscriptions(challenge.local_user_id);
    if (subscriptions.length === 0) {
      continue;
    }

    const result = await sendChallengePush(challenge, subscriptions, localNow.date);
    if (result.duplicateSuppressed) {
      skippedAlreadySent += 1;
      continue;
    }
    sent += result.sent;
    deactivated += result.deactivated;
  }

  return {
    ok: true,
    checked,
    matched,
    sent,
    skippedCheckedIn,
    skippedAlreadySent,
    deactivated,
    timestamp: now.toISOString(),
  };
}