import { deactivatePushSubscriptionByEndpoint, upsertPushSubscription } from "@/lib/api/push.functions";

export type PushReminderState = {
  supported: boolean;
  permission: NotificationPermission | "unsupported";
  subscribed: boolean;
  serviceWorkerRegistered: boolean;
  endpoint: string | null;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function getServiceWorkerRegistration() {
  return navigator.serviceWorker.register("/push-sw.js");
}

export async function getPushReminderState(): Promise<PushReminderState> {
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
    endpoint: subscription?.endpoint ?? null,
  };
}

export async function enableBackgroundPush(localUserId: string): Promise<PushReminderState> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { supported: false, permission: "unsupported", subscribed: false, serviceWorkerRegistered: false, endpoint: null };
  }

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("Missing VITE_VAPID_PUBLIC_KEY.");
  }

  const registration = await getServiceWorkerRegistration();

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return { supported: true, permission, subscribed: false, serviceWorkerRegistered: true, endpoint: null };
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Push subscription is missing required keys.");
  }

  await upsertPushSubscription({
    data: {
      localUserId,
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  });

  return { supported: true, permission, subscribed: true, serviceWorkerRegistered: true, endpoint: json.endpoint };
}

export async function disableBackgroundPush(): Promise<PushReminderState> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { supported: false, permission: "unsupported", subscribed: false, serviceWorkerRegistered: false, endpoint: null };
  }

  const registration = await getServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    await deactivatePushSubscriptionByEndpoint({ data: { endpoint } });
  }

  return {
    supported: true,
    permission: Notification.permission,
    subscribed: false,
    serviceWorkerRegistered: true,
    endpoint: null,
  };
}