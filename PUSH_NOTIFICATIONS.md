# Push Notifications

Only66 now supports real background browser push notifications using:

- Service Worker
- Push API subscription in the browser
- VAPID-authenticated Web Push delivery from the server
- Supabase as the reminder/push mirror store
- a scheduled HTTP trigger hitting `/api/push/cron`

The app still uses localStorage as the UI source of truth. Only reminder-critical state is mirrored to Supabase for background delivery.

## How It Works

1. The browser registers `public/push-sw.js`.
2. The user enables background push from onboarding or Settings.
3. The browser creates a Push API subscription.
4. The subscription is sent to the backend and stored in `push_subscriptions`.
5. The current challenge reminder state is mirrored into `reminder_challenges`.
6. Check-ins are mirrored into `reminder_check_ins`.
7. An external scheduler, or a Vercel plan that supports Cron Jobs, calls `/api/push/cron` on your chosen schedule.
8. The server checks each mirrored active challenge in the user timezone.
9. If the local reminder time matches, no check-in exists today, and a duplicate log does not already exist, the server sends Web Push.
10. The service worker receives the push event and shows the notification.

## Required Environment Variables

Client + server:

- `VITE_VAPID_PUBLIC_KEY`

Server only:

- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` optional but recommended

If you want production push reminders to work on Vercel, add these exact environment variables in the Vercel project settings:

- `VITE_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
- `VAPID_SUBJECT`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET` if you want the cron endpoint protected

## Generate VAPID Keys

Use `web-push`:

```bash
npx web-push generate-vapid-keys
```

Copy the generated public key into `VITE_VAPID_PUBLIC_KEY` and the private key into `VAPID_PRIVATE_KEY`.

Example subject:

```bash
VAPID_SUBJECT=mailto:you@example.com
```

## Apply the Supabase Migration

Apply:

- `supabase/migrations/20260529040000_push_reminders.sql`

This creates:

- `reminder_challenges`
- `reminder_check_ins`
- `push_subscriptions`
- `notification_logs`

## Local Testing

1. Set all required env vars locally.
2. Run the app.
3. Start a challenge or open Settings.
4. Enable background push reminders.
5. Confirm the debug block in Settings shows:
   - permission granted
   - service worker registered
   - push subscription exists
   - reminder synced to Supabase
6. Click `Send Test Notification` in Settings.
7. Confirm the notification is shown by the service worker, not by frontend `new Notification()`.

To test the cron endpoint manually:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain/api/push/cron
```

If `CRON_SECRET` is unset, the endpoint still works but logs a warning.

## Production Testing

1. Add all required env vars in Vercel.
2. Configure an external scheduler to call `/api/push/cron`, or use a Vercel plan that supports Cron Jobs.
3. Apply the Supabase migration in production.
4. Enable push from the live app in a supported browser.
5. Use `Send Test Notification` to verify:
   - service worker registration
   - browser subscription
   - Supabase sync
   - VAPID config
   - backend delivery

## Duplicate Protection

Daily reminders use two protections:

- `last_notification_sent_on` on `reminder_challenges`
- a unique `notification_logs` row per `(local_challenge_id, date, kind)`

The unique log acts as the cross-cron dedupe lock.

## Timezone Handling

Timezone is stored from:

```ts
Intl.DateTimeFormat().resolvedOptions().timeZone
```

Reminder time is interpreted in the user timezone on the server using `Intl.DateTimeFormat(..., { timeZone })`.

## Known Limitations

- The main app still uses localStorage for UI state.
- Reminder data is mirrored to Supabase rather than being the primary source of truth.
- If the user clears localStorage, the UI and mirror can drift until the next save/check-in sync.
- Safari/iOS/macOS push support still depends on platform/browser version and user settings.
- Push is browser/device specific. Each browser instance needs its own subscription.
- Scheduled reminders require an external scheduler unless your Vercel plan supports Cron Jobs.