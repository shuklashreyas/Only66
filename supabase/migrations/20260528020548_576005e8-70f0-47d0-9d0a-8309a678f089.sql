
-- Enums
CREATE TYPE public.challenge_kind AS ENUM ('build', 'quit');
CREATE TYPE public.challenge_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE public.challenge_tone AS ENUM ('chill', 'strict', 'brutal', 'funny');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Challenges
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  kind public.challenge_kind NOT NULL,
  motivation TEXT,
  start_date DATE NOT NULL,
  reminder_time TIME NOT NULL DEFAULT '09:00',
  tone public.challenge_tone NOT NULL DEFAULT 'strict',
  status public.challenge_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX one_active_challenge_per_user ON public.challenges (user_id) WHERE status = 'active';
CREATE INDEX challenges_user_id_idx ON public.challenges (user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.challenges TO authenticated;
GRANT ALL ON public.challenges TO service_role;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own challenges" ON public.challenges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own challenges" ON public.challenges FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own challenges" ON public.challenges FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own challenges" ON public.challenges FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Check-ins
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  difficulty INTEGER,
  notes TEXT,
  almost_folded BOOLEAN NOT NULL DEFAULT false,
  trigger TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, day_number)
);
CREATE INDEX check_ins_challenge_idx ON public.check_ins (challenge_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.check_ins TO authenticated;
GRANT ALL ON public.check_ins TO service_role;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own check_ins" ON public.check_ins FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own check_ins" ON public.check_ins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own check_ins" ON public.check_ins FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own check_ins" ON public.check_ins FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Panic events
CREATE TABLE public.panic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX panic_events_challenge_idx ON public.panic_events (challenge_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.panic_events TO authenticated;
GRANT ALL ON public.panic_events TO service_role;
ALTER TABLE public.panic_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own panic_events" ON public.panic_events FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own panic_events" ON public.panic_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own panic_events" ON public.panic_events FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
