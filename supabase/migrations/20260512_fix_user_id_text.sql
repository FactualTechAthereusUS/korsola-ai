-- Firebase UIDs are not UUIDs — change user_id to text across all billing tables

ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_fkey;
ALTER TABLE credits DROP CONSTRAINT IF EXISTS credits_user_id_fkey;
ALTER TABLE credit_transactions DROP CONSTRAINT IF EXISTS credit_transactions_user_id_fkey;

DROP POLICY IF EXISTS users_read_own_subscription ON subscriptions;
DROP POLICY IF EXISTS users_read_own_credits ON credits;
DROP POLICY IF EXISTS users_read_own_transactions ON credit_transactions;

ALTER TABLE subscriptions ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE credits ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE credit_transactions ALTER COLUMN user_id TYPE text USING user_id::text;

-- Recreate RLS policies with text comparison (Firebase UID vs auth.uid()::text)
CREATE POLICY users_read_own_subscription ON subscriptions FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY users_read_own_credits ON credits FOR SELECT USING (user_id = auth.uid()::text);
CREATE POLICY users_read_own_transactions ON credit_transactions FOR SELECT USING (user_id = auth.uid()::text);
