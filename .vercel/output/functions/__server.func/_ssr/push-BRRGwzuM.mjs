import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-B9Tqv7Ds.mjs";
import { o as objectType, b as booleanType, s as stringType, e as enumType, n as numberType } from "../_libs/zod.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const challengeToneSchema = enumType(["chill", "strict", "brutal", "funny"]);
const challengeStatusSchema = enumType(["active", "completed", "abandoned"]);
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
})).handler(createSsrRpc("0ad67c380016db25f7aa2ce898716aa017a10989a4755a1110da85c91e3031eb"));
const syncReminderCheckInSnapshot = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  localChallengeId: stringType().min(1),
  date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
  dayNumber: numberType().int().positive(),
  completed: booleanType()
})).handler(createSsrRpc("86e63accd2c9299d0cae26d0fd5d7c2b693d5b021020793cd7325d4032927156"));
createServerFn({
  method: "POST"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  endpoint: stringType().url(),
  p256dh: stringType().min(1),
  auth: stringType().min(1)
})).handler(createSsrRpc("6d3e11d6ca8532414cb1af1421bb83c536bd487e59cdd9acc97268e4267b83cc"));
createServerFn({
  method: "POST"
}).inputValidator(objectType({
  endpoint: stringType().url()
})).handler(createSsrRpc("8cc0a4bfeae3921788ea62f5bc6395db5a6d6fee7cee6147c35c7160c437825d"));
const getReminderPushDebug = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  localChallengeId: stringType().min(1)
})).handler(createSsrRpc("e978113d61120d73cbe24d4d0398da4d7f48470e845fdf20d99e576ce6f2b165"));
const sendTestPushNotification = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  localUserId: stringType().min(1),
  localChallengeId: stringType().min(1)
})).handler(createSsrRpc("3fa5bcd3d530726704e0ace9547f789a9d3d31693741c655f739e997464257db"));
async function getServiceWorkerRegistration() {
  return navigator.serviceWorker.register("/push-sw.js");
}
async function getPushReminderState() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { supported: false, permission: "unsupported", subscribed: false, serviceWorkerRegistered: false, endpoint: null };
  }
  const registration = await getServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();
  return {
    supported: true,
    permission: Notification.permission,
    subscribed: Boolean(subscription),
    serviceWorkerRegistered: true,
    endpoint: subscription?.endpoint ?? null
  };
}
async function enableBackgroundPush(localUserId) {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { supported: false, permission: "unsupported", subscribed: false, serviceWorkerRegistered: false, endpoint: null };
  }
  {
    throw new Error("Missing VITE_VAPID_PUBLIC_KEY.");
  }
}
export {
  getReminderPushDebug as a,
  syncReminderChallengeSnapshot as b,
  syncReminderCheckInSnapshot as c,
  enableBackgroundPush as e,
  getPushReminderState as g,
  sendTestPushNotification as s
};
