-- ═══════════════════════════════════════════════════════════════════════════
-- KORSOLA — Stripe Billing Schema
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Subscriptions table ────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,

  -- Stripe refs
  stripe_customer_id      text unique not null,
  stripe_subscription_id  text unique,
  stripe_price_id         text,

  -- Plan info
  plan                    text not null check (plan in ('starter', 'growth', 'scale')),
  billing                 text not null check (billing in ('monthly', 'annual')),
  status                  text not null default 'active'
                            check (status in ('active', 'canceled', 'past_due', 'trialing', 'unpaid')),

  -- Billing cycle
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean default false,

  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_stripe_customer on public.subscriptions(stripe_customer_id);

-- ── 2. Credits table ─────────────────────────────────────────────────────────
create table if not exists public.credits (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade unique,

  -- Main balance — NEVER expires
  balance         integer not null default 0 check (balance >= 0),

  -- Topup credits (separate bucket, also never expire)
  topup_balance   integer not null default 0 check (topup_balance >= 0),

  -- Lifetime stats
  total_earned    integer not null default 0,
  total_spent     integer not null default 0,

  updated_at      timestamptz default now()
);

create index if not exists idx_credits_user_id on public.credits(user_id);

-- ── 3. Credit transactions log ───────────────────────────────────────────────
create table if not exists public.credit_transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,

  -- Amount: positive = credit added, negative = credit spent
  amount          integer not null,
  balance_after   integer not null,

  -- What caused this transaction
  type            text not null check (type in (
                    'subscription_grant',
                    'topup_purchase',
                    'generation_spend',
                    'generation_refund',
                    'bonus_grant',
                    'manual_adjustment'
                  )),

  reference_id    text,
  description     text,
  created_at      timestamptz default now()
);

create index if not exists idx_credit_tx_user_id on public.credit_transactions(user_id);
create index if not exists idx_credit_tx_type on public.credit_transactions(type);
create index if not exists idx_credit_tx_created on public.credit_transactions(created_at desc);

-- ── 4. Webhook events log (idempotency) ─────────────────────────────────────
create table if not exists public.stripe_webhook_events (
  id              text primary key,
  type            text not null,
  processed_at    timestamptz default now(),
  data            jsonb
);

-- ── 5. Updated_at triggers ───────────────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.update_updated_at();

drop trigger if exists credits_updated_at on public.credits;
create trigger credits_updated_at
  before update on public.credits
  for each row execute function public.update_updated_at();

-- ── 6. Row Level Security ────────────────────────────────────────────────────
alter table public.subscriptions enable row level security;
alter table public.credits enable row level security;
alter table public.credit_transactions enable row level security;

drop policy if exists "users_read_own_subscription" on public.subscriptions;
create policy "users_read_own_subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "users_read_own_credits" on public.credits;
create policy "users_read_own_credits" on public.credits
  for select using (auth.uid() = user_id);

drop policy if exists "users_read_own_transactions" on public.credit_transactions;
create policy "users_read_own_transactions" on public.credit_transactions
  for select using (auth.uid() = user_id);

-- ── 7. Helper: get user credit balance ──────────────────────────────────────
create or replace function public.get_user_credits(p_user_id uuid)
returns integer as $$
  select coalesce(balance + topup_balance, 0)
  from public.credits
  where user_id = p_user_id;
$$ language sql security definer;
