/**
 * KORSOLA — Stripe Webhook Edge Function
 * POST /functions/v1/stripe-webhook
 *
 * Handles:
 *   checkout.session.completed      → create subscription, grant welcome bonus
 *   invoice.paid                    → grant monthly credits on renewal
 *   invoice.payment_failed          → mark subscription past_due
 *   customer.subscription.updated   → handle plan changes / cancellations
 *   customer.subscription.deleted   → mark canceled
 */

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // bypasses RLS
);

// ── Credits per plan ──────────────────────────────────────────────────────────
const PLAN_CREDITS: Record<string, number> = {
  starter: 2000,
  growth:  5000,
  scale:   15000,
};
const WELCOME_BONUS = 500;

// ── Main handler ──────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      stripe.cryptoProvider,
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return new Response(`Webhook Error: ${err instanceof Error ? err.message : err}`, { status: 400 });
  }

  // Idempotency — skip already processed events
  const { data: existing } = await supabase
    .from("stripe_webhook_events")
    .select("id")
    .eq("id", event.id)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ received: true, skipped: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Log event
  await supabase.from("stripe_webhook_events").insert({
    id:   event.id,
    type: event.type,
    data: event.data,
  });

  console.log(`[webhook] Processing: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`[webhook] Unhandled: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(`[webhook] Error processing ${event.type}:`, err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId          = session.client_reference_id;
  const stripeCustomerId = session.customer as string;
  const stripeSubId     = session.subscription as string;

  if (!userId || !stripeSubId) {
    console.error("[checkout.completed] Missing userId or subscriptionId");
    return;
  }

  const sub = await stripe.subscriptions.retrieve(stripeSubId);
  const { plan, billing, credits } = sub.metadata;

  // Upsert subscription row
  await supabase.from("subscriptions").upsert({
    user_id:                userId,
    stripe_customer_id:     stripeCustomerId,
    stripe_subscription_id: stripeSubId,
    stripe_price_id:        sub.items.data[0].price.id,
    plan,
    billing,
    status:                 sub.status,
    current_period_start:   new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end:     new Date(sub.current_period_end   * 1000).toISOString(),
    cancel_at_period_end:   sub.cancel_at_period_end,
  }, { onConflict: "stripe_subscription_id" });

  // Ensure credits row exists
  await supabase.from("credits").upsert({
    user_id:       userId,
    balance:       0,
    topup_balance: 0,
    total_earned:  0,
    total_spent:   0,
  }, { onConflict: "user_id" });

  // Grant welcome bonus on first subscription only
  const { data: txHistory } = await supabase
    .from("credit_transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("type", "bonus_grant")
    .limit(1);

  if (!txHistory || txHistory.length === 0) {
    await addCredits({
      userId,
      amount:      WELCOME_BONUS,
      type:        "bonus_grant",
      referenceId: session.id,
      description: "Welcome Kit — 500 bonus credits",
    });
    console.log(`[checkout.completed] Granted ${WELCOME_BONUS} welcome bonus to ${userId}`);
  }

  console.log(`[checkout.completed] Subscription created: ${plan}/${billing} for user ${userId}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const sub    = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const userId = sub.metadata.user_id;
  const plan   = sub.metadata.plan;

  if (!userId || !plan) {
    console.error("[invoice.paid] Missing userId or plan in subscription metadata");
    return;
  }

  const creditsToGrant = PLAN_CREDITS[plan];

  // Idempotency — skip if this invoice already granted credits
  const { data: existingTx } = await supabase
    .from("credit_transactions")
    .select("id")
    .eq("reference_id", invoice.id)
    .eq("type", "subscription_grant")
    .single();

  if (existingTx) {
    console.log(`[invoice.paid] Already granted for invoice ${invoice.id}`);
    return;
  }

  await addCredits({
    userId,
    amount:      creditsToGrant,
    type:        "subscription_grant",
    referenceId: invoice.id as string,
    description: `${plan} plan — ${sub.metadata.billing} — ${creditsToGrant} credits`,
  });

  // Update subscription period dates
  await supabase.from("subscriptions")
    .update({
      status:               "active",
      current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
      current_period_end:   new Date(sub.current_period_end   * 1000).toISOString(),
    })
    .eq("stripe_subscription_id", invoice.subscription as string);

  console.log(`[invoice.paid] Granted ${creditsToGrant} credits to ${userId} (${plan})`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;
  await supabase.from("subscriptions")
    .update({ status: "past_due" })
    .eq("stripe_subscription_id", invoice.subscription as string);
  console.log(`[payment_failed] Marked past_due: ${invoice.subscription}`);
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const updates: Record<string, unknown> = {
    status:               sub.status,
    stripe_price_id:      sub.items.data[0].price.id,
    cancel_at_period_end: sub.cancel_at_period_end,
    current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
    current_period_end:   new Date(sub.current_period_end   * 1000).toISOString(),
  };
  if (sub.metadata.plan) {
    updates.plan    = sub.metadata.plan;
    updates.billing = sub.metadata.billing;
  }
  await supabase.from("subscriptions").update(updates).eq("stripe_subscription_id", sub.id);
  console.log(`[subscription.updated] ${sub.id} → ${sub.status}`);
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await supabase.from("subscriptions")
    .update({ status: "canceled", cancel_at_period_end: false })
    .eq("stripe_subscription_id", sub.id);
  console.log(`[subscription.deleted] Canceled: ${sub.id}`);
  // Credits stay — they never expire, even after cancellation
}

// ── Credit utility ────────────────────────────────────────────────────────────
async function addCredits({
  userId, amount, type, referenceId, description,
}: {
  userId: string; amount: number; type: string; referenceId: string; description: string;
}) {
  const { data: creditRow } = await supabase
    .from("credits")
    .select("balance, total_earned")
    .eq("user_id", userId)
    .single();

  const currentBalance = (creditRow?.balance ?? 0);
  const newBalance     = currentBalance + amount;

  await supabase.from("credits")
    .update({
      balance:      newBalance,
      total_earned: (creditRow?.total_earned ?? 0) + amount,
    })
    .eq("user_id", userId);

  await supabase.from("credit_transactions").insert({
    user_id:       userId,
    amount,
    balance_after: newBalance,
    type,
    reference_id:  referenceId,
    description,
  });

  return newBalance;
}
