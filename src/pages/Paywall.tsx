import { useState, useCallback, useEffect } from "react";
import { trackInitiateCheckout } from "@/lib/pixel";
import { Check, X, ChevronDown, Sparkles, Shield, ArrowRight, Info, Clock } from "lucide-react";
import { LpGradientCTA } from "@/components/marketing/lp/LpGradientCTA";
import logoLight from "@/assets/logo-light.webp";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter",
    name: "STARTER",
    badge: null,
    badgeColor: "",
    borderColor: "border-white/10",
    headerBg: "",
    monthly: 97,
    firstMonth: 68,
    annual: 78,
    annualTotal: 936,
    monthlyPriceId: "price_1TW1iYK1bYgwYcn0vOn2Qrur",
    annualPriceId:  "price_1TW1iZK1bYgwYcn07KPcS6s1",
    credits: 2000,
    creditsLabel: "2,000 credits/mo",
    seedance: 8,
    kling: 11,
    images: 250,
    seats: "1 seat",
    cta: "Get Starter",
    ctaStyle: "white",
    description: "For DTC brands just getting started with AI ads",
    highlight: [
      "50 UGC video ads per month",
      "11 Kling 3.0 motion videos per month",
      "2,000 credits — roll forward forever",
      "Unlimited FLUX image generation",
      "250 Nano Banana Pro 4K images",
      "Shopify product catalog sync",
      "Background removal",
      "AI captions and subtitles",
    ],
    missing: ["Spaces workflow canvas", "Priority generation queue", "API access", "Dedicated support"],
    unlimited: [
      { label: "Nano Banana Pro", available: false, badge: null },
      { label: "Nano Banana 2", available: false, badge: null },
    ],
  },
  {
    id: "growth",
    name: "GROWTH",
    badge: "MOST POPULAR",
    badgeColor: "bg-[#ff3e8a]",
    borderColor: "border-[#ff3e8a]/60",
    headerBg: "bg-[#ff3e8a]",
    monthly: 197,
    firstMonth: 138,
    annual: 158,
    annualTotal: 1896,
    monthlyPriceId: "price_1TW1iaK1bYgwYcn0iW8ImqBU",
    annualPriceId:  "price_1TW1iaK1bYgwYcn0G3g4o578",
    credits: 5000,
    creditsLabel: "5,000 credits/mo",
    seedance: 20,
    kling: 28,
    images: 625,
    seats: "3 seats",
    cta: "Get Growth for $138 first month",
    ctaStyle: "pink",
    description: "For brands scaling their creative testing",
    highlight: [
      "Everything in Starter, plus:",
      "200 UGC video ads per month",
      "28 Kling 3.0 motion videos per month",
      "5,000 credits — roll forward forever",
      "625 Nano Banana Pro 4K images",
      "Spaces workflow canvas ✦",
      "Priority generation queue ✦",
    ],
    missing: ["API access", "Dedicated support"],
    unlimited: [
      { label: "Nano Banana Pro", available: false, badge: "NO UNLIMITED" },
      { label: "Nano Banana 2", available: true, badge: "2K UNLIMITED" },
    ],
  },
  {
    id: "scale",
    name: "SCALE",
    badge: "BEST VALUE",
    badgeColor: "bg-[#5b3bff]",
    borderColor: "border-[#5b3bff]/60",
    headerBg: "bg-[#5b3bff]",
    monthly: 497,
    firstMonth: 348,
    annual: 398,
    annualTotal: 4776,
    monthlyPriceId: "price_1TW1ibK1bYgwYcn0Jf3RzLeI",
    annualPriceId:  "price_1TW1ibK1bYgwYcn0xca8krrH",
    credits: 15000,
    creditsLabel: "15,000 credits/mo",
    seedance: 60,
    kling: 85,
    images: 1875,
    seats: "Unlimited seats",
    cta: "Get Scale",
    ctaStyle: "purple",
    description: "For agencies and high-volume ad teams",
    highlight: [
      "Everything in Growth, plus:",
      "600 UGC video ads per month",
      "85 Kling 3.0 motion videos per month",
      "15,000 credits — roll forward forever",
      "1,875 Nano Banana Pro 4K images",
      "Full API access ✦",
      "Dedicated support ✦",
      "Custom workflow templates",
    ],
    missing: [],
    unlimited: [
      { label: "Nano Banana Pro", available: true, badge: "2K UNLIMITED" },
      { label: "Nano Banana 2", available: true, badge: "2K UNLIMITED" },
    ],
  },
];

const COMPARE_ROWS = [
  { category: "AI VIDEO", displayName: "AI video", rows: [
    { label: "Seedance 2.0 — 15-sec AI video", badge: "POPULAR", creditCost: "250 cr/video", starter: "8 videos", growth: "20 videos", scale: "60 videos" },
    { label: "Kling 3.0 Motion Control", badge: "LATEST", creditCost: "175 cr/video", starter: "11 videos", growth: "28 videos", scale: "85 videos" },
  ]},
  { category: "AI IMAGES", displayName: "AI image", rows: [
    { label: "AI Image Generation (FLUX)", badge: "FREE", creditCost: "0 cr/image", starter: "∞ Unlimited", growth: "∞ Unlimited", scale: "∞ Unlimited" },
    { label: "Premium 4K Images", badge: "NEW", creditCost: "8 cr/image", starter: "250 images", growth: "625 images", scale: "1,875 images" },
  ]},
  { category: "EDITING & UTILITY", displayName: "Editing & utility", rows: [
    { label: "Remove Background", badge: null, creditCost: "3 cr/use", starter: "666 uses", growth: "1,666 uses", scale: "5,000 uses" },
    { label: "AI Captions", badge: null, creditCost: "3 cr/use", starter: "666 uses", growth: "1,666 uses", scale: "5,000 uses" },
    { label: "Extend Video", badge: "NEW", creditCost: "75 cr/use", starter: "26 uses", growth: "66 uses", scale: "200 uses" },
    { label: "Image Upscale", badge: null, creditCost: "4 cr/use", starter: "500 uses", growth: "1,250 uses", scale: "3,750 uses" },
  ]},
  { category: "PLATFORM", displayName: "Platform", rows: [
    { label: "Native Shopify Sync", badge: null, creditCost: null, starter: true, growth: true, scale: true },
    { label: "Spaces Workflow Canvas", badge: "NEW", creditCost: null, starter: false, growth: true, scale: true },
    { label: "Priority Queue", badge: null, creditCost: null, starter: false, growth: true, scale: true },
    { label: "API Access", badge: null, creditCost: null, starter: false, growth: false, scale: true },
    { label: "Dedicated Support", badge: null, creditCost: null, starter: false, growth: false, scale: true },
    { label: "Seats", badge: null, creditCost: null, starter: "1 seat", growth: "3 seats", scale: "Unlimited" },
  ]},
];

const FAQ_ITEMS = [
  { q: "Do my credits expire?", a: "Never. Your credits roll forward indefinitely — unused credits carry into next month, the month after, and every month until you use them. No expiry dates, no warnings, no credits disappearing at midnight. This is in our Terms of Service and it doesn't change." },
  { q: "What if a generation fails or the output isn't usable?", a: "You get your credits back automatically. We only charge credits for outputs you can actually use. If a generation errors out, stalls, or produces something clearly broken, the credits are refunded to your account instantly — no support ticket needed." },
  { q: "How many videos do I actually get per month?", a: "On Growth: 20 Seedance 2.0 videos and 11 Kling 3.0 motion control videos if you spend all credits on video. Most brands mix — 10 Seedance videos, 5 Kling videos, 200+ product images, editing tools — and still carry credits forward. AI image generation is unlimited on every plan." },
  { q: "How is Korsola cheaper than Arcads if the price looks similar?", a: "Arcads gives you 8,000–16,000 credits but charges 1,200 credits per video. That's 6–13 videos per month. We charge 250 credits per video and give 2,000–5,000 credits. That's 8–20 videos — at a lower monthly price. Arcads charges $16.50 per video. We charge $9.85. Same technology. 40% cheaper per video." },
  { q: "What does Shopify integration actually do?", a: "Connect your store once. Your full product catalog syncs automatically — every product, every image, every variant. When you open Korsola, your products are already there. No uploading, no copying URLs, no manual work. Every new product you add to Shopify appears in Korsola automatically." },
  { q: "Can I use the videos and images for commercial purposes?", a: "Yes, fully. Everything you generate on Korsola — videos, images, edited content — is yours to use commercially. Run it on Meta, TikTok, YouTube, anywhere. No attribution required, no royalties, no licensing complications." },
  { q: "Can I cancel anytime?", a: "Yes. Monthly plans cancel anytime with no penalty — your access continues until the end of the billing period. Annual plans are billed yearly; you can cancel to stop renewal, but the current year is non-refundable after the 7-day guarantee window. Your unused credits are yours until your plan ends." },
  { q: "What is Seedance 2.0?", a: "Seedance 2.0 is the most advanced AI video model available today — the same technology powering the top AI video platforms. Korsola routes it through our infrastructure so you get the same quality at a lower price per generation, with your Shopify product catalog connected directly as the visual reference." },
  { q: "Is there a free trial?", a: "No. Free trials attract people who never convert and waste everyone's time. Instead: your first month is 30% off, you get a Welcome Kit worth $251, and if you don't generate 3 ready-to-run ads in your first 7 days, we refund you in full — no questions asked. That's a better deal than any trial." },
  { q: "Can I buy extra credits if I run out?", a: "Yes. Top-up credit packs are available at any time inside your account — no plan upgrade required. Small pack: 500 credits for $25. Large pack: 2,500 credits for $85. Top-up credits never expire and are used after your monthly plan credits are depleted." },
];

const WELCOME_KIT = [
  { label: "500 Bonus Credits", value: "$24 value", desc: "Extra credits on top of plan — run 2 free Seedance videos the moment you sign up" },
  { label: "Hook Formula Library", value: "$79 value", desc: "47 proven opening hooks for Meta & TikTok ads, broken down by product type (beauty, health, fashion, home)" },
  { label: "DTC Ad Swipe File", value: "$99 value", desc: "100 highest-performing DTC ad breakdowns — what the hook was, why it worked, the structure" },
  { label: "AI Prompt Pack", value: "$49 value", desc: "30 plug-and-play Korsola prompts optimized for your product category — copy, paste, generate" },
  { label: "Shopify Fast-Track Guide", value: "Exclusive", desc: "Connect store → sync catalog → first ad in under 10 minutes" },
  { label: "Founding Member Rate Lock", value: "Priceless", desc: "First 500 customers lock in today's pricing forever" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlanCTA({ plan, annual }: { plan: typeof PLANS[0]; annual: boolean }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Firebase auth

  const handleCheckout = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        // Not logged in — send to /auth, come back to paywall after
        navigate("/auth", { state: { from: "/onboarding/paywall" } });
        return;
      }

      const priceId = annual ? plan.annualPriceId : plan.monthlyPriceId;
      const billing = annual ? "annual" : "monthly";

      // Fire InitiateCheckout before redirecting to Stripe
      trackInitiateCheckout(plan.name, annual ? plan.annual : plan.monthly);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

      const res = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          priceId,
          billing,
          userId: user.uid,           // Firebase UID
          userEmail: user.email ?? "",
        }),
      });

      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error("[checkout]", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [annual, plan, navigate, user]);

  const label = loading ? "Redirecting..." : (
    annual
      ? plan.cta.replace("$138", `$${plan.annual}`).replace("first month", "billed annually")
      : plan.cta
  );

  if (plan.ctaStyle === "white") {
    return (
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-[52px] rounded-2xl bg-white text-black text-[15px] font-bold hover:bg-white/90 transition-colors disabled:opacity-60"
      >
        {label} {!loading && "→"}
      </button>
    );
  }
  if (plan.ctaStyle === "pink") {
    return (
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full h-[52px] rounded-2xl bg-[#ff3e8a] text-white text-[15px] font-bold hover:bg-[#e0306e] transition-colors shadow-[0_8px_24px_-6px_rgba(255,62,138,0.5)] disabled:opacity-60"
      >
        {label} {!loading && "→"}
      </button>
    );
  }
  // purple
  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full h-[52px] rounded-2xl bg-[#5b3bff] text-white text-[15px] font-bold hover:bg-[#4a2de0] transition-colors shadow-[0_8px_24px_-6px_rgba(91,59,255,0.5)] disabled:opacity-60"
    >
      {label} {!loading && "→"}
    </button>
  );
}

function CreditsIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`shrink-0 ${className}`}>
      <path d="M11.8525 4.21651L11.7221 3.2387C11.6906 3.00226 11.4889 2.82568 11.2504 2.82568C11.0118 2.82568 10.8102 3.00226 10.7786 3.23869L10.6483 4.21651C10.2658 7.0847 8.00939 9.34115 5.14119 9.72358L4.16338 9.85396C3.92694 9.88549 3.75037 10.0872 3.75037 10.3257C3.75037 10.5642 3.92694 10.7659 4.16338 10.7974L5.14119 10.9278C8.00938 11.3102 10.2658 13.5667 10.6483 16.4349L10.7786 17.4127C10.8102 17.6491 11.0118 17.8257 11.2504 17.8257C11.4889 17.8257 11.6906 17.6491 11.7221 17.4127L11.8525 16.4349C12.2349 13.5667 14.4913 11.3102 17.3595 10.9278L18.3374 10.7974C18.5738 10.7659 18.7504 10.5642 18.7504 10.3257C18.7504 10.0872 18.5738 9.88549 18.3374 9.85396L17.3595 9.72358C14.4913 9.34115 12.2349 7.0847 11.8525 4.21651Z" />
      <path d="M4.6519 14.7568L4.82063 14.2084C4.84491 14.1295 4.91781 14.0757 5.00037 14.0757C5.08292 14.0757 5.15582 14.1295 5.1801 14.2084L5.34883 14.7568C5.56525 15.4602 6.11587 16.0108 6.81925 16.2272L7.36762 16.3959C7.44652 16.4202 7.50037 16.4931 7.50037 16.5757C7.50037 16.6582 7.44652 16.7311 7.36762 16.7554L6.81926 16.9241C6.11587 17.1406 5.56525 17.6912 5.34883 18.3946L5.1801 18.9429C5.15582 19.0218 5.08292 19.0757 5.00037 19.0757C4.91781 19.0757 4.84491 19.0218 4.82063 18.9429L4.65191 18.3946C4.43548 17.6912 3.88486 17.1406 3.18147 16.9241L2.63311 16.7554C2.55421 16.7311 2.50037 16.6582 2.50037 16.5757C2.50037 16.4931 2.55421 16.4202 2.63311 16.3959L3.18148 16.2272C3.88486 16.0108 4.43548 15.4602 4.6519 14.7568Z" />
    </svg>
  );
}

function getBadgeStyle(badge: string) {
  switch (badge) {
    case "LATEST": return "bg-white/8 text-white/50 border-white/15";
    case "NEW": return "bg-[#2ee24d]/10 text-[#2ee24d] border-[#2ee24d]/25";
    case "POPULAR": return "bg-[#ff3e8a]/10 text-[#ff3e8a] border-[#ff3e8a]/25";
    case "FREE": return "bg-emerald-400/10 text-emerald-400 border-emerald-400/25";
    default: return "bg-white/8 text-white/50 border-white/15";
  }
}

function CompareCell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-5 h-5 text-[#2ee24d] mx-auto" strokeWidth={2.5} />;
  if (value === false) return <X className="w-4 h-4 text-white/20 mx-auto" />;
  const isHighlight = value === "∞ Unlimited";
  return (
    <span className={`text-[13px] font-semibold ${isHighlight ? "text-[#2ee24d]" : "text-white/80"}`}>
      {value}
    </span>
  );
}

function CompareCellNew({ value, accent }: { value: string | boolean; accent?: "pink" | "purple" }) {
  if (value === true) {
    const color = accent === "pink" ? "text-[#ff3e8a]" : accent === "purple" ? "text-[#8b7bff]" : "text-[#2ee24d]";
    return <Check className={`w-[18px] h-[18px] mx-auto ${color}`} strokeWidth={2.5} />;
  }
  if (value === false) return <span className="text-white/15 text-[18px] leading-none">—</span>;
  const isUnlimited = value === "∞ Unlimited";
  const color = isUnlimited
    ? accent === "pink" ? "text-[#ff3e8a]" : accent === "purple" ? "text-[#8b7bff]" : "text-[#2ee24d]"
    : "text-white/80";
  return (
    <span
      className={`text-[13px] font-bold text-center leading-tight ${color}`}
      style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
    >
      {value}
    </span>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-[15px] font-semibold text-white">{q}</span>
        <ChevronDown className={`w-5 h-5 text-white/40 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="pb-5 text-[14px] text-white/60 leading-relaxed -mt-1">{a}</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Paywall() {
  const [annual, setAnnual] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const navigate = useNavigate();
  const { isActive, loading } = useSubscription();

  // Already subscribed — skip paywall entirely
  useEffect(() => {
    if (!loading && isActive) {
      navigate("/create", { replace: true });
    }
  }, [isActive, loading, navigate]);

  return (
    <div
      className="min-h-screen bg-ink text-white relative overflow-hidden"
      style={{ fontFamily: "Montserrat, system-ui, -apple-system, sans-serif" }}
    >
      {/* Ambient purple gradient orbs — mirrors LP dark section */}
      <div className="pointer-events-none absolute -top-40 -left-60 w-[600px] h-[600px] rounded-full bg-[#4f3bd6]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-[30%] -right-60 w-[700px] h-[700px] rounded-full bg-[#8b7bff]/15 blur-3xl" />
      <div className="pointer-events-none absolute top-[60%] -left-60 w-[700px] h-[700px] rounded-full bg-[#4f3bd6]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-60 w-[600px] h-[600px] rounded-full bg-[#8b7bff]/15 blur-3xl" />
      {/* ── Nav ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
        <a href="/home" className="flex items-center gap-2">
          <img src={logoLight} alt="Korsola" className="w-7 h-7 object-contain" />
          <span className="text-[14px] font-extrabold tracking-[0.14em] text-white">KORSOLA</span>
        </a>
        <a href="/auth" className="text-[13px] text-white/40 hover:text-white transition-colors">
          Sign in
        </a>
      </div>

      {/* ── Price Anchor Banner ── */}
      <div className="border-b border-white/8 px-6 py-3"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          background: "rgba(255,255,255,0.04)",
        }}>
        <p className="text-center text-[12px] sm:text-[13px] text-white/60 leading-relaxed">
          Replacing{" "}
          <span className="text-white/80 line-through">$3,210–$8,210/mo</span>
          {" "}in UGC creators + tools →{" "}
          <span className="text-[#2ee24d] font-bold">Korsola from $6.57/day</span>
          <span className="hidden sm:inline"> · 7-day money-back guarantee</span>
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-24">

        {/* ── Heading ── */}
        <div className="text-center pt-14 pb-10">
          <h1
            className="text-[36px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-tight leading-[1.1] text-white mb-4"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            Simple, <span className="font-serif italic font-normal">honest pricing.</span><br />
            <span className="text-white/45">No surprises. <span className="font-serif italic font-normal">Ever.</span></span>
          </h1>
          <p className="text-[15px] sm:text-[16px] text-white/45 max-w-[560px] mx-auto leading-relaxed" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            Credits only charge on successful outputs. Unused credits carry forward every month, forever. Cancel anytime.
          </p>

          {/* Trusted by — stacked avatars */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <div className="flex items-center -space-x-2.5">
              {[
                "/formats/preset-avatar-blonde.png",
                "/formats/preset-avatar-beret.png",
                "/formats/preset-avatar-pinkcap.png",
                "/formats/preset-avatar-lotuspj.jpg",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#080808]"
                  style={{ zIndex: 4 - i }}
                />
              ))}
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 text-[13px] text-white/70 font-medium"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Trusted by <span className="text-white font-bold">500+</span> biggest brands &amp; agencies
            </div>
          </div>
        </div>

        {/* ── Billing Toggle ── */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setAnnual(false)}
            className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${!annual ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-11 h-6 rounded-full relative transition-colors ${annual ? "bg-[#2ee24d]" : "bg-white/15"}`}
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all duration-200 ${annual ? "left-6" : "left-1"}`} />
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
          >
            Annual
            <span className="bg-[#2ee24d] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 20%</span>
          </button>
        </div>

        {/* ── Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border ${plan.borderColor} overflow-hidden flex flex-col ${plan.badge ? "md:-mt-2 md:mb-2" : ""}`}
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.08) 100%)",
                backdropFilter: "blur(48px) saturate(180%)",
                WebkitBackdropFilter: "blur(48px) saturate(180%)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 0 rgba(255,255,255,0.18) inset, 0 28px 60px -12px rgba(0,0,0,0.55)",
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`${plan.headerBg} px-4 py-2 flex items-center justify-center gap-1.5`}>
                  <svg className="w-3.5 h-3.5 text-white shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.56218 3.52331C6.89119 3.18855 7.34089 3 7.81027 3H16.186C16.6554 3 17.1051 3.18855 17.4341 3.52331L22.5881 8.76722C23.2614 9.45231 23.2567 10.5521 22.5774 11.2313L13.2356 20.5732C12.5521 21.2566 11.4441 21.2566 10.7607 20.5732L1.41881 11.2313C0.73957 10.5521 0.734815 9.45231 1.40816 8.76722L6.56218 3.52331ZM9.02845 7.21967C9.32135 7.51256 9.32135 7.98744 9.02845 8.28033L7.30878 10L9.02845 11.7197C9.32135 12.0126 9.32135 12.4874 9.02845 12.7803C8.73556 13.0732 8.26069 13.0732 7.96779 12.7803L5.71779 10.5303C5.4249 10.2374 5.4249 9.76256 5.71779 9.46967L7.96779 7.21967C8.26069 6.92678 8.73556 6.92678 9.02845 7.21967Z" fill="currentColor" /></svg>
                  <span className="text-[11px] font-bold tracking-[0.12em] text-white">{plan.badge}</span>
                </div>
              )}

              <div className="p-5 sm:p-6 flex flex-col flex-1">
                {/* Spacer to align credits box with badged cards */}
                {!plan.badge && <div className="h-[37px] shrink-0" />}
                {/* Plan name & desc */}
                <div className="mb-5">
                  <h2 className="text-[22px] font-extrabold tracking-tight text-white">{plan.name}</h2>
                  <p className="text-[12px] text-white/40 mt-0.5">{plan.description}</p>
                </div>

                {/* Credits box */}
                <div className="bg-white/[0.05] rounded-2xl p-4 mb-5">
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <CreditsIcon className="w-4 h-4 text-[#2ee24d] mt-[1px]" />
                    <span className="text-[20px] font-bold text-white">{plan.credits.toLocaleString()}</span>
                    <span className="text-[13px] text-white/50">credits/mo</span>
                  </div>
                  <div className="text-[12px] text-white/40 space-y-0.5 mt-2">
                    <p>= {plan.seedance} Seedance 2.0 videos per month</p>
                    <p>= {plan.kling} Kling 3.0 motion videos per month</p>
                    <p>= {(plan.images).toLocaleString()} premium 4K images per month</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/8 flex items-center gap-1.5 text-[11px] text-white/40">
                    <CreditsIcon className="w-3.5 h-3.5 mt-[1px]" />
                    Credits never expire — roll forward forever
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {annual ? (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[42px] font-extrabold leading-none text-white">${plan.annual}</span>
                          <p className="text-[12px] text-white/35 mt-1.5">per month, billed annually</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[26px] font-bold leading-none" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.25)" }}>${plan.monthly}</span>
                          <p className="mt-1.5">
                            <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "rgba(46,226,77,0.12)", color: "#2ee24d", border: "1px solid rgba(46,226,77,0.22)" }}>−20%</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-white/30 mt-2">Save ${((plan.monthly - plan.annual) * 12).toLocaleString()}/yr vs monthly</p>
                    </>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[42px] font-extrabold leading-none text-white">${plan.firstMonth}</span>
                        </div>
                        <p className="text-[12px] text-white/35 mt-1.5">per month</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[26px] font-bold leading-none" style={{ color: "rgba(255,255,255,0.25)", textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.25)" }}>${plan.monthly}</span>
                        <p className="mt-1.5">
                          <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,62,138,0.18)", color: "#ff3e8a", border: "1px solid rgba(255,62,138,0.25)" }}>−30%</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mb-6">
                  <PlanCTA plan={plan} annual={annual} />
                  {!annual && plan.id !== "starter" && (
                    <p className="text-center text-[11px] text-white/30 mt-2">
                      Save ${((plan.monthly - plan.annual) * 12).toLocaleString()}/yr with annual
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2.5 flex-1">
                  {plan.highlight.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-[13px] text-white/70">
                      <Check className="w-4 h-4 text-[#2ee24d] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{f.replace(" ✦", "")}{f.includes("✦") ? <span className="text-[#2ee24d] ml-1">✦</span> : null}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-[13px] text-white/25">
                      <X className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* 7-Day Unlimited */}
                <div className="mt-5 rounded-2xl overflow-hidden border border-white/10"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                  }}>
                  <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/8">
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-white/50 shrink-0">
                        <path fillRule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2.5 5V4.5a2.5 2.5 0 0 0-5 0V6h5Z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-[11px] font-bold tracking-[0.12em] text-white/60 uppercase">7-Day Unlimited</span>
                    </div>
                    <button className="text-[11px] text-white/35 hover:text-white/60 underline underline-offset-2 transition-colors">Learn more</button>
                  </div>
                  {plan.unlimited.map((item) => (
                    <div key={item.label} className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.05] last:border-0">
                      <div className="flex items-center gap-2">
                        {item.available
                          ? <Check className="w-3.5 h-3.5 text-[#2ee24d] shrink-0" strokeWidth={2.5} />
                          : <X className="w-3.5 h-3.5 text-white/20 shrink-0" strokeWidth={2} />}
                        <span className={`text-[12px] ${item.available ? "text-white/70" : "text-white/25"}`}>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide ${item.badge === "NO UNLIMITED" ? "bg-white/10 text-white/35" : "bg-[#2ee24d] text-black"}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Seats */}
                <div className="mt-5 pt-4 border-t border-white/8 text-[12px] text-white/40 flex items-center gap-1.5">
                  <span className="text-white/60 font-semibold">{plan.seats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Enterprise section ── */}
        <div
          className="mt-8 rounded-3xl border border-white/10 p-7 sm:p-10 lg:p-12"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.07) 100%)",
            backdropFilter: "blur(48px) saturate(180%)",
            WebkitBackdropFilter: "blur(48px) saturate(180%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 0 rgba(255,255,255,0.16) inset, 0 32px 80px -16px rgba(0,0,0,0.6)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 lg:gap-14">

            {/* Left */}
            <div>
              <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold tracking-tight text-white leading-[1.12]"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                AI ad infrastructure for teams that <span className="font-serif italic font-normal">produce at scale.</span>
              </h2>
              <p className="mt-3 text-[13px] sm:text-[14px] text-white/45 leading-relaxed max-w-[540px]"
                style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                Shared credits, dedicated workflows, full admin control, and no training on your data. Built for agencies and high-volume DTC teams.
              </p>

              {/* 3 feature cards */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    icon: <Shield className="w-5 h-5 text-white/60" />,
                    title: "Security & Compliance",
                    desc: "Your data is never used for model training. Every asset you generate belongs to you, with full commercial usage rights.",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white/60">
                        <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4Zm0 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2Zm1 5a1 1 0 0 0 0 2h12a1 1 0 0 0 0-2H4Z" />
                      </svg>
                    ),
                    title: "Data & Usage Rights",
                    desc: "You own every output — no restrictions on use, editing, or publishing across Meta, TikTok, and any other platform.",
                  },
                  {
                    icon: (
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white/60">
                        <path d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM17 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07ZM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5Z" />
                      </svg>
                    ),
                    title: "Admin & Team Control",
                    desc: "Set permissions, manage credit allocation per team member, and track usage across every project from one dashboard.",
                  },
                ].map((card) => (
                  <div key={card.title}
                    className="rounded-2xl p-4 border border-white/8"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="mb-3">{card.icon}</div>
                    <p className="text-[13px] font-bold text-white mb-1.5" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>{card.title}</p>
                    <p className="text-[12px] text-white/40 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — checklist + CTAs */}
            <div className="flex flex-col justify-between gap-6">
              <div>
                <p className="text-[12px] font-bold tracking-[0.14em] text-white/35 uppercase mb-4"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  Everything on Growth, plus:
                </p>
                <div className="space-y-2.5">
                  {[
                    "Unlimited team seats",
                    "15,000 credits per month",
                    "Custom credit top-ups",
                    "Full API access",
                    "Priority generation queue",
                    "Dedicated onboarding support",
                    "Volume-based credit discounts",
                    "Spaces workflow canvas",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#2ee24d] shrink-0" strokeWidth={2.5} />
                      <span className="text-[13px] text-white/70" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2.5 mt-2">
                <button className="w-full h-[50px] rounded-2xl bg-white text-black text-[14px] font-bold hover:bg-white/90 transition-colors"
                  style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  Start with Scale
                </button>
                <button className="w-full h-[50px] rounded-2xl border border-white/15 text-white text-[14px] font-semibold hover:bg-white/[0.06] transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", fontFamily: "'Manrope', system-ui, sans-serif" }}>
                  Contact Sales
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Compare Plans ── */}
        <div className="mt-20">
          {/* Section heading */}
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold tracking-[0.18em] text-white/30 uppercase mb-3">Compare plans</p>
            <h2
              className="text-[32px] sm:text-[44px] font-extrabold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
            >
              Exact <span className="font-serif italic font-normal">output per plan</span>
            </h2>
            <p className="text-[14px] text-white/40 mt-2" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
              Exact output per plan — every tool, every model
            </p>
          </div>

          {/* Scrollable table — overflow-x only, no overflow-y so sticky works */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div
              className="min-w-[640px] mx-0 rounded-3xl relative overflow-hidden"
              style={{
                fontFamily: "'Manrope', system-ui, sans-serif",
                background: "linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.07) 100%)",
                backdropFilter: "blur(48px) saturate(180%)",
                WebkitBackdropFilter: "blur(48px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 0 rgba(255,255,255,0.16) inset, 0 32px 80px -16px rgba(0,0,0,0.6)",
              }}
            >
              {/* Top sheen line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-30" />

              {/* ── Sticky plan header ── */}
              <div
                className="sticky top-0 z-20 grid rounded-t-3xl border-b border-white/10"
                style={{
                  gridTemplateColumns: "minmax(0,1.9fr) repeat(3, minmax(0,1fr))",
                  background: "rgba(8,8,8,0.60)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                }}
              >
                {/* Top-left label */}
                <div className="px-6 py-5 flex items-end">
                  <p className="text-[11px] font-bold tracking-[0.12em] text-white/25 uppercase">
                    What you can create
                  </p>
                </div>

                {/* Starter */}
                <div className="px-4 py-4 border-l border-white/8 flex flex-col items-center gap-2">
                  <p className="text-[14px] font-extrabold text-white tracking-tight">Starter</p>
                  <span className="flex items-center gap-1 text-[11px] text-white/35 font-medium">
                    <CreditsIcon className="w-3.5 h-3.5 mt-[1px]" />2,000 cr/mo
                  </span>
                  <button className="w-full h-8 rounded-xl bg-white/10 hover:bg-white/15 text-white text-[12px] font-semibold transition-colors border border-white/10">
                    Get Started
                  </button>
                </div>

                {/* Growth */}
                <div className="px-4 py-4 border-l border-white/8 flex flex-col items-center gap-2 relative">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-[#ff3e8a]" />
                  <p className="text-[14px] font-extrabold text-[#ff3e8a] tracking-tight">Growth</p>
                  <span className="flex items-center gap-1 text-[11px] text-white/35 font-medium">
                    <CreditsIcon className="w-3.5 h-3.5 mt-[1px]" />5,000 cr/mo
                  </span>
                  <button className="w-full h-8 rounded-xl bg-[#ff3e8a] hover:bg-[#e0306e] text-white text-[12px] font-semibold transition-colors shadow-[0_4px_16px_-4px_rgba(255,62,138,0.55)]">
                    Get Started
                  </button>
                </div>

                {/* Scale */}
                <div className="px-4 py-4 border-l border-white/8 flex flex-col items-center gap-2 relative rounded-tr-2xl">
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-[#5b3bff]" />
                  <p className="text-[14px] font-extrabold text-[#8b7bff] tracking-tight">Scale</p>
                  <span className="flex items-center gap-1 text-[11px] text-white/35 font-medium">
                    <CreditsIcon className="w-3.5 h-3.5 mt-[1px]" />15,000 cr/mo
                  </span>
                  <button className="w-full h-8 rounded-xl bg-[#5b3bff] hover:bg-[#4a2de0] text-white text-[12px] font-semibold transition-colors shadow-[0_4px_16px_-4px_rgba(91,59,255,0.55)]">
                    Get Started
                  </button>
                </div>
              </div>

              {/* ── Rows by category ── */}
              {COMPARE_ROWS.map((section, si) => (
                <div key={section.category}>
                  {/* Category header row */}
                  <div
                    className={`grid border-t ${si === 0 ? "border-white/0" : "border-white/8"} bg-white/[0.04]`}
                    style={{ gridTemplateColumns: "minmax(0,1.9fr) repeat(3, minmax(0,1fr))" }}
                  >
                    <div className="col-span-4 px-6 py-3 flex items-center gap-2">
                      <span className="text-[14px] font-bold text-white/75">{section.displayName}</span>
                      <Info className="w-3.5 h-3.5 text-white/25" />
                    </div>
                  </div>

                  {/* Feature rows */}
                  {section.rows.map((row) => (
                    <div
                      key={row.label}
                      className="grid border-t border-white/[0.06] hover:bg-white/[0.015] transition-colors"
                      style={{ gridTemplateColumns: "minmax(0,1.9fr) repeat(3, minmax(0,1fr))" }}
                    >
                      {/* Feature label */}
                      <div className="px-6 py-3.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] text-white/85 font-semibold leading-snug">
                            {row.label}
                          </p>
                          {row.badge && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold tracking-[0.07em] uppercase border ${getBadgeStyle(row.badge)}`}>
                              {row.badge}
                            </span>
                          )}
                        </div>
                        {row.creditCost && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <CreditsIcon className="w-3 h-3 mt-[1px] text-white/25" />
                            <span className="text-[11px] text-white/28">{row.creditCost}</span>
                          </div>
                        )}
                      </div>

                      {/* Starter value */}
                      <div className="px-4 py-3.5 flex items-center justify-center border-l border-white/[0.06]">
                        <CompareCellNew value={row.starter} />
                      </div>

                      {/* Growth value */}
                      <div className="px-4 py-3.5 flex items-center justify-center border-l border-white/[0.06]">
                        <CompareCellNew value={row.growth} accent="pink" />
                      </div>

                      {/* Scale value */}
                      <div className="px-4 py-3.5 flex items-center justify-center border-l border-white/[0.06]">
                        <CompareCellNew value={row.scale} accent="purple" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Footer */}
              <div className="px-6 py-4 rounded-b-3xl bg-[#2ee24d]/[0.04] border-t border-[#2ee24d]/10">
                <p className="text-[12px] text-[#2ee24d]/70 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                  Your credits never expire. Unused credits carry forward every month, forever.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Credits Never Expire ── */}
        <div className="mt-16">
          <div className="rounded-3xl border border-white/10 overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.07) 100%)",
              backdropFilter: "blur(48px) saturate(180%)",
              WebkitBackdropFilter: "blur(48px) saturate(180%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 0 rgba(255,255,255,0.18) inset, 0 28px 60px -12px rgba(0,0,0,0.55)",
            }}>
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.07]">
              <h2 className="text-[28px] sm:text-[36px] font-extrabold tracking-tight text-white" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Credits that <span className="font-serif italic font-normal">actually work for you</span></h2>
              <p className="text-[14px] text-white/40 mt-2">No traps. No gotchas.</p>
            </div>
            {/* Comparison panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">
              {/* Competitors */}
              <div className="p-7">
                <p className="text-[11px] font-bold tracking-[0.14em] text-red-400/70 mb-5 uppercase" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>What competitors do</p>
                <div className="space-y-3.5">
                  {[
                    "Credits expire at end of month — use them or lose them",
                    "Failed generations still cost credits",
                    '"Unlimited" plans throttle after 20 generations',
                    "Credits deducted for errored-out jobs",
                    "Platform changes credit rates mid-subscription",
                    "No warning before credits disappear",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-[13px] text-white/35">
                      <X className="w-4 h-4 text-red-400/50 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Korsola */}
              <div className="p-7"
                style={{ background: "linear-gradient(145deg, rgba(46,226,77,0.05) 0%, rgba(46,226,77,0.01) 100%)" }}>
                <p className="text-[11px] font-bold tracking-[0.14em] text-[#2ee24d]/70 mb-5 uppercase" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>What Korsola does</p>
                <div className="space-y-3.5">
                  {[
                    "Credits never expire — roll forward indefinitely",
                    "Failed generations are automatically refunded",
                    "No hidden throttles, ever",
                    "Credit cost shown before you generate",
                    "Rate locked at signup — never changed mid-subscription",
                    "30-day advance notice for any plan changes",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-[13px] text-white/75">
                      <Check className="w-4 h-4 text-[#2ee24d] shrink-0 mt-0.5" strokeWidth={2.5} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Welcome Kit ── */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2ee24d]/10 border border-[#2ee24d]/20 text-[#2ee24d] text-[12px] font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Included with every plan
            </div>
            <h2 className="text-[28px] sm:text-[36px] font-extrabold tracking-tight text-white" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Welcome Kit — <span className="font-serif italic font-normal">$298+ value</span></h2>
            <p className="text-[14px] text-white/40 mt-2">Everything you need to go from zero to running ads in 24 hours</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WELCOME_KIT.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 p-5"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.06) 100%)",
                  backdropFilter: "blur(48px) saturate(180%)",
                  WebkitBackdropFilter: "blur(48px) saturate(180%)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 2px 0 rgba(255,255,255,0.12) inset, 0 20px 40px -10px rgba(0,0,0,0.4)",
                }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-[14px] font-bold text-white">{item.label}</p>
                  <span className="bg-[#2ee24d]/10 text-[#2ee24d] text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0">{item.value}</span>
                </div>
                <p className="text-[12px] text-white/45 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Founding Member Scarcity ── */}
        <div className="mt-12 rounded-3xl border border-white/10 p-8 sm:p-10 text-center"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.07) 100%)",
            backdropFilter: "blur(48px) saturate(180%)",
            WebkitBackdropFilter: "blur(48px) saturate(180%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.10) inset, 0 2px 0 rgba(255,255,255,0.16) inset, 0 32px 80px -16px rgba(0,0,0,0.6)",
          }}>
          <div className="text-[11px] font-bold tracking-[0.15em] text-white/40 uppercase mb-3">Founding Member Pricing</div>
          <h3 className="text-[24px] sm:text-[32px] font-extrabold text-white mb-2" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Lock in <span className="font-serif italic font-normal">today's price forever</span></h3>
          <p className="text-[14px] text-white/50 mb-4 max-w-[480px] mx-auto">
            First 500 customers lock in founding pricing permanently.
          </p>
          <div className="flex items-center justify-center gap-6 mb-6 text-[13px] text-white/35" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
            <span>Starter <span className="text-white/55 font-semibold">→ $149/mo</span></span>
            <span className="text-white/15">·</span>
            <span>Growth <span className="text-white/55 font-semibold">→ $249/mo</span></span>
            <span className="text-white/15">·</span>
            <span>Scale <span className="text-white/55 font-semibold">→ $599/mo</span></span>
          </div>
          {/* Progress bar */}
          <div className="max-w-[360px] mx-auto mb-6">
            <div className="flex justify-between text-[12px] text-white/40 mb-2">
              <span>423 spots claimed</span>
              <span>500 total</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(91,59,255,0.15)" }}>
              <div className="h-full rounded-full" style={{ width: "84.6%", background: "linear-gradient(90deg, #5b3bff 0%, #8b7bff 100%)", boxShadow: "0 0 12px rgba(91,59,255,0.6)" }} />
            </div>
            <p className="text-[#2ee24d] text-[12px] font-bold mt-2">77 spots remaining</p>
          </div>
          <LpGradientCTA href="/auth" className="mx-auto !w-[280px]">
            Claim Founding Pricing
          </LpGradientCTA>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-[28px] sm:text-[36px] font-extrabold tracking-tight text-white" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Frequently <span className="font-serif italic font-normal">asked questions</span></h2>
          </div>
          <div className="max-w-[720px] mx-auto">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 text-center">
          <p className="text-[18px] sm:text-[22px] font-extrabold text-white mb-6" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>Ready to replace <span className="font-serif italic font-normal">your creators?</span></p>
          <LpGradientCTA href="/auth" size="lg" className="mx-auto !w-[380px]">
            Start Generating — First Month 30% Off →
          </LpGradientCTA>
          <p className="text-[12px] text-white/30 mt-5 flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
            <span>✓ Credits only charged on successful outputs</span>
            <span className="text-white/15">·</span>
            <span>✓ Unused credits never expire</span>
            <span className="text-white/15">·</span>
            <span>✓ Cancel anytime</span>
          </p>
        </div>
      </div>
    </div>
  );
}
