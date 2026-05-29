declare module "web-push" {
  export type PushSubscription = {
    endpoint: string;
    expirationTime?: number | null;
    keys?: {
      p256dh?: string;
      auth?: string;
    };
  };

  export type WebPushResponse = {
    statusCode?: number;
    headers?: Record<string, string>;
    body?: string;
  };

  export type SendOptions = {
    TTL?: number;
    vapidDetails?: {
      subject?: string;
      publicKey?: string;
      privateKey?: string;
    };
    contentEncoding?: "aesgcm" | "aes128gcm";
    urgency?: "very-low" | "low" | "normal" | "high";
    topic?: string;
    timeout?: number;
    proxy?: string;
    agent?: unknown;
  };

  export type WebPush = {
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    sendNotification(
      subscription: PushSubscription | globalThis.PushSubscription,
      payload?: string | null,
      options?: SendOptions,
    ): Promise<WebPushResponse>;
  };

  const webpush: WebPush;
  export default webpush;
}

declare module "@lovable.dev/cloud-auth-js" {
  type SupportedProvider = "google" | "apple" | "microsoft" | "lovable";

  type OAuthTokens = {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
    expires_at?: number;
    token_type?: string;
    user?: unknown;
  };

  type SignInResult = {
    redirected?: boolean;
    error?: Error;
    tokens: OAuthTokens;
  };

  export function createLovableAuth(): {
    signInWithOAuth(
      provider: SupportedProvider,
      options?: {
        redirect_uri?: string;
        extraParams?: Record<string, string>;
      },
    ): Promise<SignInResult>;
  };
}
