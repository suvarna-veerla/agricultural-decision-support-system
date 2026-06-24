/*
# Create profiles and farm_analyses tables

1. New Tables:
- `profiles`: id (uuid PK → auth.users), email, full_name, phone, location, language (default 'te'), role (default 'farmer'), created_at
- `farm_analyses`: id (uuid PK), user_id (uuid FK defaults auth.uid()), crop_name, location, lat, lng, acres, soil_type, yield/finance fields, recommendations (jsonb), created_at

2. Security: RLS on both. Owner-scoped CRUD + admin read-all.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL, full_name text NOT NULL, phone text, location text,
  language text NOT NULL DEFAULT 'te', role text NOT NULL DEFAULT 'farmer',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "admin_read_profiles" ON profiles;
CREATE POLICY "admin_read_profiles" ON profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE TABLE IF NOT EXISTS farm_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name text NOT NULL, location text NOT NULL,
  latitude double precision NOT NULL, longitude double precision NOT NULL,
  acres double precision NOT NULL, soil_type text NOT NULL,
  expected_yield double precision NOT NULL, yield_confidence integer NOT NULL,
  climate_risk_score integer NOT NULL, investment_cost double precision NOT NULL,
  expected_revenue double precision NOT NULL, profit_loss double precision NOT NULL,
  roi_percentage double precision NOT NULL, recommendations jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE farm_analyses ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_farm_analyses_user_id ON farm_analyses(user_id);

DROP POLICY IF EXISTS "select_own_analyses" ON farm_analyses;
CREATE POLICY "select_own_analyses" ON farm_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_analyses" ON farm_analyses;
CREATE POLICY "insert_own_analyses" ON farm_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_analyses" ON farm_analyses;
CREATE POLICY "update_own_analyses" ON farm_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_analyses" ON farm_analyses;
CREATE POLICY "delete_own_analyses" ON farm_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "admin_read_analyses" ON farm_analyses;
CREATE POLICY "admin_read_analyses" ON farm_analyses FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
