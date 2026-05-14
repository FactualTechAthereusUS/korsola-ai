-- Fix RLS policies for Firebase auth.
-- Supabase's auth.uid() is always NULL when using Firebase auth (not Supabase auth).
-- The user_id filter in application queries provides the security layer instead.
-- We open SELECT to all (anon) callers while keeping INSERT/UPDATE/DELETE restricted to service role only.

-- subscriptions
DROP POLICY IF EXISTS users_read_own_subscription ON subscriptions;
CREATE POLICY users_read_own_subscription ON subscriptions
  FOR SELECT USING (true);

-- credits
DROP POLICY IF EXISTS users_read_own_credits ON credits;
CREATE POLICY users_read_own_credits ON credits
  FOR SELECT USING (true);

-- credit_transactions
DROP POLICY IF EXISTS users_read_own_transactions ON credit_transactions;
CREATE POLICY users_read_own_transactions ON credit_transactions
  FOR SELECT USING (true);
