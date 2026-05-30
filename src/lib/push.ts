import {
  deactivatePushSubscriptionByEndpoint,
  upsertPushSubscription,
} from "@/lib/api/push.functions";

export type PushReminderState = {
  supported: boolean;
  configured: boolean;
  configurationStatus: "present" | "missing" | "invalid";
  configurationError: string | null;
  permission: NotificationPermission | "unsupported";
  subscribed: boolean;
  serviceWorkerRegistered: boolean;
  endpoint: string | null;
};

function getPushConfiguration(publicKey: string | undefined) {
  const value = publicKey?.trim();

  if (!value) {
    return {
      configured: false,
      configurationStatus: "missing" as const,
      configurationError: "Push is not configured. Missing VITE_VAPID_PUBLIC_KEY.",
    };
  }

  const isLikelyVapidPublicKey = /^[A-Za-z0-9_-]{80,120}$/.test(value);
  if (!isLikelyVapidPublicKey) {
    return {
      configured: false,
      configurationStatus: "invalid" as const,
      configurationError:
        "Push is configured, but VITE_VAPID_PUBLIC_KEY looks malformed in this deployment.",
    };
  }

  return {
    configured: true,
    configurationStatus: "present" as const,
    configurationError: null,
  };
}

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
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const configuration = getPushConfiguration(publicKey);

  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return {
      supported: false,
      configured: configuration.configured,
      configurationStatus: configuration.configurationStatus,
      configurationError: configuration.configurationError,
      permission: "unsupported",
      subscribed: false,
      serviceWorkerRegistered: false,
      endpoint: null,
    };
  }

  const registration = await getServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();

  return {
    supported: true,
    configured: configuration.configured,
    configurationStatus: configuration.configurationStatus,
    configurationError: configuration.configurationError,
    permission: Notification.permission,
    subscribed: Boolean(subscription),
    serviceWorkerRegistered: true,
    endpoint: subscription?.endpoint ?? null,
  };
}

export async function enableBackgroundPush(localUserId: string): Promise<PushReminderState> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    return {
      supported: false,
      configured: false,
      configurationStatus: "missing",
      configurationError: "Push is not configured in this browser context.",
      permission: "unsupported",
      subscribed: false,
      serviceWorkerRegistered: false,
      endpoint: null,
    };
  }

  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const configuration = getPushConfiguration(publicKey);
  if (!configuration.configured) {
    throw new Error(
      configuration.configurationError ||
        "Push notifications are not configured for this deployment.",
    );
  }

  const registration = await getServiceWorkerRegistration();

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return {
      supported: true,
      configured: true,
      configurationStatus: "present",
      configurationError: null,
      permission,
      subscribed: false,
      serviceWorkerRegistered: true,
      endpoint: null,
    };
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

  return {
    supported: true,
    configured: true,
    configurationStatus: "present",
    configurationError: null,
    permission,
    subscribed: true,
    serviceWorkerRegistered: true,
    endpoint: json.endpoint,
  };
}

export async function disableBackgroundPush(): Promise<PushReminderState> {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    const configuration = getPushConfiguration(import.meta.env.VITE_VAPID_PUBLIC_KEY);
    return {
      supported: false,
      configured: configuration.configured,
      configurationStatus: configuration.configurationStatus,
      configurationError: configuration.configurationError,
      permission: "unsupported",
      subscribed: false,
      serviceWorkerRegistered: false,
      endpoint: null,
    };
  }

  const registration = await getServiceWorkerRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    await deactivatePushSubscriptionByEndpoint({ data: { endpoint } });
  }

  const configuration = getPushConfiguration(import.meta.env.VITE_VAPID_PUBLIC_KEY);
  return {
    supported: true,
    configured: configuration.configured,
    configurationStatus: configuration.configurationStatus,
    configurationError: configuration.configurationError,
    permission: Notification.permission,
    subscribed: false,
    serviceWorkerRegistered: true,
    endpoint: null,
  };
}
