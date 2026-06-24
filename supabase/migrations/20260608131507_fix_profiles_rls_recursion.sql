-- Fix infinite recursion: use a security definer function instead of self-referencing RLS

CREATE OR REPLACE FUNCTION is_admin() RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "admin_read_profiles" ON profiles;
-- Replace with non-recursive version using the definer function
CREATE POLICY "admin_read_profiles" ON profiles FOR SELECT TO authenticated USING (is_admin());

-- Same fix for farm_analyses
DROP POLICY IF EXISTS "admin_read_analyses" ON farm_analyses;
CREATE POLICY "admin_read_analyses" ON farm_analyses FOR SELECT TO authenticated USING (is_admin());

-- Allow newly registered users to insert their own profile even during signup
-- (the auth.uid() check works because signUp returns a session)
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
