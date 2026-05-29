import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const challengeToneSchema = z.enum(["chill", "strict", "brutal", "funny"]);
const challengeStatusSchema = z.enum(["active", "completed", "abandoned"]);

export const syncReminderChallengeSnapshot = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      localUserId: z.string().min(1),
      displayName: z.string().trim().min(1).nullable(),
      challenge: z.object({
        localChallengeId: z.string().min(1),
        challengeName: z.string().min(1),
        tone: challengeToneSchema,
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        reminderTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
        timezone: z.string().min(1),
        status: challengeStatusSchema,
        notificationEnabled: z.boolean(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const { upsertReminderChallengeSnapshot } = await import("@/lib/push.server");
    await upsertReminderChallengeSnapshot(data);
    return { ok: true };
  });

export const syncReminderCheckInSnapshot = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      localUserId: z.string().min(1),
      localChallengeId: z.string().min(1),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      dayNumber: z.number().int().positive(),
      completed: z.boolean(),
    }),
  )
  .handler(async ({ data }) => {
    const { upsertReminderCheckInSnapshot } = await import("@/lib/push.server");
    await upsertReminderCheckInSnapshot(data);
    return { ok: true };
  });

export const upsertPushSubscription = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      localUserId: z.string().min(1),
      endpoint: z.string().url(),
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { upsertPushSubscriptionSnapshot } = await import("@/lib/push.server");
    await upsertPushSubscriptionSnapshot(data);
    return { ok: true };
  });

export const deactivatePushSubscriptionByEndpoint = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      endpoint: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    const { deactivatePushSubscription } = await import("@/lib/push.server");
    await deactivatePushSubscription(data.endpoint);
    return { ok: true };
  });