CREATE TABLE public.reminder_challenges (
  local_challenge_id TEXT PRIMARY KEY,
  local_user_id TEXT NOT NULL,
  display_name TEXT,
  challenge_name TEXT NOT NULL,
  tone public.challenge_tone NOT NULL,
  start_date DATE NOT NULL,
  reminder_time TIME NOT NULL,
  timezone TEXT NOT NULL,
  status public.challenge_status NOT NULL DEFAULT 'active',
  notification_enabled BOOLEAN NOT NULL DEFAULT false,
  last_notification_sent_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX reminder_challenges_lookup_idx
  ON public.reminder_challenges (status, notification_enabled, reminder_time);

CREATE INDEX reminder_challenges_user_idx
  ON public.reminder_challenges (local_user_id);

CREATE TABLE public.reminder_check_ins (
  local_challenge_id TEXT NOT NULL REFERENCES public.reminder_challenges(local_challenge_id) ON DELETE CASCADE,
  local_user_id TEXT NOT NULL,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (local_challenge_id, date)
);

CREATE INDEX reminder_check_ins_user_idx
  ON public.reminder_check_ins (local_user_id, date);

CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX push_subscriptions_user_idx
  ON public.push_subscriptions (local_user_id, active);

GRANT ALL ON public.reminder_challenges TO service_role;
GRANT ALL ON public.reminder_check_ins TO service_role;
GRANT ALL ON public.push_subscriptions TO service_role;

ALTER TABLE public.reminder_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER reminder_challenges_updated_at
  BEFORE UPDATE ON public.reminder_challenges
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();