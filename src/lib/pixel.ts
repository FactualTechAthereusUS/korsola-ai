/**
 * Meta Pixel helper — thin wrapper around window.fbq
 * Only fires if the pixel has loaded (safe to call anywhere).
 */

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/** Fire on every route change (already handled by the pixel init 'PageView' in index.html for the first load) */
export function trackPageView() {
  fbq("track", "PageView");
}

/** After Firebase sign-up succeeds */
export function trackLead() {
  fbq("track", "Lead");
}

/** When user clicks a Subscribe button on the Paywall */
export function trackInitiateCheckout(plan: string, value: number) {
  fbq("track", "InitiateCheckout", {
    content_name: plan,
    currency: "USD",
    value,
  });
}

/** NOT used from the browser — Purchase is fired server-side via CAPI for accuracy */
// export function trackPurchase() { ... }
