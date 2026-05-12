import { Sparkles } from "lucide-react";
import closingBg from "@/assets/closing-cta-bg.webp";
import { SplitWords } from "@/components/marketing/SplitWords";

export function LpClosingCTA() {
  return (
    <section className="relative min-h-[360px] md:h-[480px] overflow-hidden">
      <img
        src={closingBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
        loading="lazy"
        decoding="async"
      />
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center py-12 md:py-0">
        <div className="max-w-3xl text-left">
          <h2 className="font-display font-extrabold text-white text-[36px] sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
            <SplitWords>Your next</SplitWords>{" "}
            <SplitWords className="font-serif italic font-normal" delay={0.14}>winning ad</SplitWords>{" "}
            <SplitWords delay={0.28}>is one click away.</SplitWords>
          </h2>
          <p className="mt-5 max-w-xl text-white/75 text-[16px] leading-relaxed font-body drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            Plug in your Shopify store, pick a creator, and ship dozens of on-brand UGC ads before your coffee gets cold.
          </p>
          <div className="mt-8">
            <a
              href="/auth"
              className="group relative inline-flex items-center justify-center gap-2 h-12 w-[220px] rounded-full text-[15px] font-semibold text-white whitespace-nowrap overflow-hidden border border-white/40 bg-gradient-to-b from-[#cfc4ff] via-[#8b7bff] to-[#4f3bd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(40,20,120,0.5),0_10px_30px_rgba(99,58,232,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(40,20,120,0.6),0_14px_38px_rgba(99,58,232,0.7)] transition-all duration-300"
            >
              <span className="absolute top-0 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              <span className="relative drop-shadow-[0_1px_1px_rgba(40,20,120,0.4)]">Create Your AI Ad</span>
              <Sparkles className="relative w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
