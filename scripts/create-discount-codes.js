/**
 * Creates 6 single-use 100% off Stripe promotion codes.
 * Usage: node scripts/create-discount-codes.js sk_live_YOUR_KEY
 */

const secretKey = process.argv[2];
if (!secretKey || !secretKey.startsWith("sk_")) {
  console.error("Usage: node scripts/create-discount-codes.js sk_live_YOUR_KEY");
  process.exit(1);
}

const CODES = [
  "koenXfactual",
  "techieXfactual",
  "BlazeXFactual",
  "ghostXfactual",
  "enhanceXfactual",
  "proffessorXfactual",
];

async function stripe(method, path, body) {
  const params = new URLSearchParams();
  if (body) {
    for (const [k, v] of Object.entries(body)) {
      params.append(k, String(v));
    }
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body ? params : undefined,
  });
  return res.json();
}

async function main() {
  // Coupon JPJ9FREf already created (100% off, once)
  const couponId = "JPJ9FREf";
  console.log(`Using existing coupon: ${couponId}\n`);

  // Create one promotion code per name (max_redemptions: 1)
  for (const code of CODES) {
    const promo = await stripe("POST", "/promotion_codes", {
      coupon: couponId,
      code,
      max_redemptions: "1",
    });

    if (promo.error) {
      console.error(`✗ ${code}: ${promo.error.message}`);
    } else {
      console.log(`✓ ${code}`);
    }
  }

  console.log("\nAll done! Codes are live in your Stripe dashboard.");
  console.log("https://dashboard.stripe.com/promotion_codes");
}

main();
