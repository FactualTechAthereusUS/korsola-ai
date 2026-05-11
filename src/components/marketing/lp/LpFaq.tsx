import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
  {
    q: "Is this actually better than hiring real UGC creators?",
    a: "For volume, speed, and iteration — yes, by an order of magnitude. A real creator typically delivers 1 finished video in 5–7 days at $150–$400 per asset, and you're locked into their face, their schedule, and their interpretation of your brief. Korsola delivers 20 fully-edited variations in under 20 minutes at roughly $8 each, with full control over hook, pacing, format, and avatar. For DTC brands testing angles at scale across Meta, TikTok, and YouTube, there is no comparison on cost-per-tested-ad. We still recommend hiring real creators for hero spots and brand films — Korsola is built for the daily grind of testing 50 hooks a week.",
  },
  {
    q: "How do I make my first ad with Korsola?",
    a: "Three steps, no learning curve. (1) Paste your Shopify product URL or drag in a product image — Korsola auto-extracts the photo, copy, and brand context. (2) Pick an avatar from our library or upload your own (one selfie is enough — we lock the face, voice, and style). (3) Choose a format: UGC reel, unboxing, product showcase, try-on, tutorial, or static carousel. Hit generate and your first batch of 5–20 variations is ready in minutes, fully edited with hook, captions, voiceover, and CTA.",
  },
  {
    q: "Do I need to know how to prompt or edit video?",
    a: "Zero technical experience required. Korsola writes the hook, the script, the dialogue, and the call-to-action automatically using Claude Sonnet 4.5 trained on the highest-converting ad patterns from Meta and TikTok ads libraries. You pick the format, pick the avatar, and generate. There is no prompt engineering, no timeline editing, no After Effects, no Premiere. If you want to go deeper, our Spaces canvas lets advanced users chain models, branch ideas, and remix winning ads — but the default flow is point-and-click.",
  },
  {
    q: "Will these ads actually run on Meta, TikTok, YouTube, and Shopify?",
    a: "Yes — every generation is exported in the correct aspect ratio, resolution, codec, and audio loudness for each platform. 9:16 vertical for Reels, TikTok, and Shorts. 1:1 square for feed. 16:9 horizontal for YouTube and Shopify product pages. Captions are burned in for sound-off viewing. Audio is normalized to platform spec (Meta -14 LUFS, TikTok -10 LUFS). Files are encoded H.264/AAC under per-platform size limits. Download direct or push straight into Meta Ads Manager and TikTok Ads Manager via our native integrations.",
  },
  {
    q: "How does my avatar stay consistent across every ad?",
    a: "Every generation from the same avatar uses a locked reference seed plus our proprietary style-lock layer. Your character on day 1 looks identical to your character on day 90 — same face, same voice, same wardrobe palette, same lighting feel — across hundreds of variations and dozens of products. No drift, no retraining, no awkward week-2 \"is that the same person?\" moment. You can also lock multiple avatars per brand kit so different products feature different recurring creators, building real audience recognition over time.",
  },
  {
    q: "What AI models does Korsola use, and can I choose between them?",
    a: "We run a curated stack of the best model for each job: Seedance 2.0 and Kling 3.0 for video generation and motion control, Nano Banana Pro and FLUX 2 Pro for image generation and high-resolution creative, Claude Sonnet 4.5 for scripts and hooks, ElevenLabs for voice. You can let Korsola route automatically based on format, or pick the model yourself in Spaces. Either way, the credit cost is shown upfront before you generate — no surprise overages, no hidden upgrade tiers, no per-model paywalls.",
  },
  {
    q: "Do you train on my content or sell my data?",
    a: "Never. Every asset Korsola generates is yours — full commercial rights, no watermarks, no attribution required. We do not train any model on your product images, your brand assets, your generated outputs, or your prompts. We do not sell or share your data with third parties. Infrastructure is SOC 2 Type II audited and GDPR compliant, with regional data residency available on Scale and Enterprise plans. Your data stays yours, your ads stay yours, your competitive edge stays yours.",
  },
  {
    q: "Is there a free trial or money-back guarantee?",
    a: "No free plan and no trial — instead, your first month is 30% off on every plan. You pay to get in and immediately get access to the full platform: every model, every format, every integration. Most brands generate enough winning ads in their first week to cover the entire month's subscription. If Korsola isn't a fit in the first 14 days, email support and we'll refund unused credits, no questions asked.",
  },
  {
    q: "Can my whole team work in Korsola together?",
    a: "Yes. Growth and Scale plans include team seats with shared credit pools, shared brand profiles, shared avatar libraries, and shared project folders. One credit pool, no per-seat fees, full visibility on who generated what. Your media buyer, creative director, and editor work from the same source of truth — same avatars, same brand kit, same canvases. Role-based permissions, per-user credit limits, and SSO are available on Enterprise.",
  },
];

export function LpFaq() {
  return (
    <section className="text-white py-24 md:py-32 relative overflow-hidden">

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-display font-extrabold text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
          <span className="font-serif italic font-normal">Frequently</span> asked questions
        </h2>
        <p className="mt-6 text-white/60 text-[16px] md:text-[17px] mx-auto font-body max-w-sm md:max-w-none">
          Everything you need to know before your first generation.
        </p>

        <Accordion type="single" collapsible className="mt-14 text-left divide-y divide-white/10 max-w-4xl mx-auto">
          {items.map((it, i) => (
            <AccordionItem key={i} value={`f-${i}`} className="border-0">
              <AccordionTrigger className="py-6 text-lg font-display font-bold text-white hover:no-underline">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-white/65 text-base leading-relaxed pb-6 font-body">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <a href="/faq" className="inline-block mt-10 text-white/70 hover:text-white text-[14px] font-semibold transition-colors">
          See the full FAQ →
        </a>
      </div>
    </section>
  );
}
