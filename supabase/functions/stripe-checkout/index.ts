/**
 * KORSOLA — Stripe Checkout Edge Function
 * POST /functions/v1/stripe-checkout
 * Body: { priceId, billing: 'monthly'|'annual', userId, userEmail }
 * Returns: { url } — redirect to Stripe checkout
 */

import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

// ── Credit amounts per price ID ───────────────────────────────────────────────
const PLAN_CREDITS: Record<string, { plan: string; credits: number; billing: string }> = {
  [Deno.env.get("STRIPE_STARTER_MONTHLY_PRICE") ?? ""]:  { plan: "starter", credits: 2000, billing: "monthly" },
  [Deno.env.get("STRIPE_STARTER_ANNUAL_PRICE") ?? ""]:   { plan: "starter", credits: 2000, billing: "annual"  },
  [Deno.env.get("STRIPE_GROWTH_MONTHLY_PRICE") ?? ""]:   { plan: "growth",  credits: 5000, billing: "monthly" },
  [Deno.env.get("STRIPE_GROWTH_ANNUAL_PRICE") ?? ""]:    { plan: "growth",  credits: 5000, billing: "annual"  },
  [Deno.env.get("STRIPE_SCALE_MONTHLY_PRICE") ?? ""]:    { plan: "scale",  credits: 15000, billing: "monthly" },
  [Deno.env.get("STRIPE_SCALE_ANNUAL_PRICE") ?? ""]:     { plan: "scale",  credits: 15000, billing: "annual"  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { priceId, billing, userId, userEmail } = await req.json();

    if (!priceId || !userId || !userEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: priceId, userId, userEmail" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const planInfo = PLAN_CREDITS[priceId];
    if (!planInfo) {
      return new Response(
        JSON.stringify({ error: "Invalid price ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const appUrl = Deno.env.get("APP_URL") ?? "https://korsola.com";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: userEmail,
      client_reference_id: userId,

      // Allow promo codes on all plans (enables KORSOLATEST 100% off for testing)
      // Note: can't use allow_promotion_codes + discounts simultaneously
      allow_promotion_codes: true,

      subscription_data: {
        metadata: {
          user_id: userId,
          plan: planInfo.plan,
          billing: planInfo.billing,
          credits: String(planInfo.credits),
        },
      },

      success_url: `${appUrl}/create?subscribed=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/onboarding/paywall?canceled=true`,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[stripe-checkout] Error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
