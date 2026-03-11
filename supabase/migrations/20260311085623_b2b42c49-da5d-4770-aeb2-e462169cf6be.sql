
CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Public read/write since this is a shared config portal (no auth)
CREATE POLICY "Allow public read" ON public.app_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public insert" ON public.app_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.app_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
