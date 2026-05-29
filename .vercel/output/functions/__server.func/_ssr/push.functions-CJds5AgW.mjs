import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-BDbOBauc.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, b as booleanType, s as stringType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const challengeToneSchema = enumType(["chill", "strict", "brutal", "funny"]);
const challengeStatusSchema = enumType(["active", "completed", "abandoned"]);
const syncReminderChallengeSnapshot_createServerFn_handler = createServerRpc({
  id: "0ad67c380016db25f7aa2ce898716aa017a10989a4755a1110da85c91e3031eb",
  name: "syncReminderChallengeSnapshot",
  filename: "src/lib/api/push.functions.ts"
}, (opts) => syncReminderChallengeSnapshot.__executeServer(opts));
const syncReminderChallengeSnapshot = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  displayName: stringType().trim().min(1).nullable(),
  challenge: objectType({
    localChallengeId: stringType().min(1),
    challengeName: stringType().min(1),
    tone: challengeToneSchema,
    startDate: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
    reminderTime: stringType().regex(/^\d{2}:\d{2}:\d{2}$/),
    timezone: stringType().min(1),
    status: challengeStatusSchema,
    notificationEnabled: booleanType()
  })
})).handler(syncReminderChallengeSnapshot_createServerFn_handler, async ({
  data
}) => {
  const {
    upsertReminderChallengeSnapshot
  } = await import("./push.server-C7OQsCv1.mjs");
  await upsertReminderChallengeSnapshot(data);
  return {
    ok: true
  };
});
const syncReminderCheckInSnapshot_createServerFn_handler = createServerRpc({
  id: "86e63accd2c9299d0cae26d0fd5d7c2b693d5b021020793cd7325d4032927156",
  name: "syncReminderCheckInSnapshot",
  filename: "src/lib/api/push.functions.ts"
}, (opts) => syncReminderCheckInSnapshot.__executeServer(opts));
const syncReminderCheckInSnapshot = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  localChallengeId: stringType().min(1),
  date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayNumber: numberType().int().positive(),
  completed: booleanType()
})).handler(syncReminderCheckInSnapshot_createServerFn_handler, async ({
  data
}) => {
  const {
    upsertReminderCheckInSnapshot
  } = await import("./push.server-C7OQsCv1.mjs");
  await upsertReminderCheckInSnapshot(data);
  return {
    ok: true
  };
});
const upsertPushSubscription_createServerFn_handler = createServerRpc({
  id: "6d3e11d6ca8532414cb1af1421bb83c536bd487e59cdd9acc97268e4267b83cc",
  name: "upsertPushSubscription",
  filename: "src/lib/api/push.functions.ts"
}, (opts) => upsertPushSubscription.__executeServer(opts));
const upsertPushSubscription = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  endpoint: stringType().url(),
  p256dh: stringType().min(1),
  auth: stringType().min(1)
})).handler(upsertPushSubscription_createServerFn_handler, async ({
  data
}) => {
  const {
    upsertPushSubscriptionSnapshot
  } = await import("./push.server-C7OQsCv1.mjs");
  await upsertPushSubscriptionSnapshot(data);
  return {
    ok: true
  };
});
const deactivatePushSubscriptionByEndpoint_createServerFn_handler = createServerRpc({
  id: "8cc0a4bfeae3921788ea62f5bc6395db5a6d6fee7cee6147c35c7160c437825d",
  name: "deactivatePushSubscriptionByEndpoint",
  filename: "src/lib/api/push.functions.ts"
}, (opts) => deactivatePushSubscriptionByEndpoint.__executeServer(opts));
const deactivatePushSubscriptionByEndpoint = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  endpoint: stringType().url()
})).handler(deactivatePushSubscriptionByEndpoint_createServerFn_handler, async ({
  data
}) => {
  const {
    deactivatePushSubscription
  } = await import("./push.server-C7OQsCv1.mjs");
  await deactivatePushSubscription(data.endpoint);
  return {
    ok: true
  };
});
export {
  deactivatePushSubscriptionByEndpoint_createServerFn_handler,
  syncReminderChallengeSnapshot_createServerFn_handler,
  syncReminderCheckInSnapshot_createServerFn_handler,
  upsertPushSubscription_createServerFn_handler
};
