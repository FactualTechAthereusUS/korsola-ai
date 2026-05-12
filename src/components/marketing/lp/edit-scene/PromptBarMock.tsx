import { forwardRef } from "react";
import { Plus, Volume2, ChevronDown, Smartphone, Gem, Clock } from "lucide-react";
import { LpGradientCTA } from "../LpGradientCTA";
import { Typewriter } from "./Typewriter";
import { GeneratingOverlay } from "./GeneratingOverlay";
import { PRODUCT_IMG_SRC } from "./scene-assets";
import { motion, MotionValue } from "framer-motion";

export type SlotRefs = {
  bar: React.RefObject<HTMLDivElement>;
  videoSlot: React.RefObject<HTMLDivElement>;
  productSlot: React.RefObject<HTMLDivElement>;
  textarea: React.RefObject<HTMLDivElement>;
  generate: React.RefObject<HTMLDivElement>;
};

type Props = {
  slots: SlotRefs;
  promptText: string;
  typingProgress: MotionValue<number>;
  productOpacity: MotionValue<number>;
  generating: boolean;
  generatePressed: boolean;
};

/**
 * Pixel-faithful replica of the Marketing Studio PromptBar — visual only,
 * no Supabase / store / modals. All slot positions are exposed via refs so
 * FakeCursor + Video1 can land precisely on them.
 *
 * Responsive: slots shrink on mobile, generate button always visible.
 */
export const PromptBarMock = forwardRef<HTMLDivElement, Props>(function PromptBarMock(
  { slots, promptText, typingProgress, productOpacity, generating, generatePressed },
  ref,
) {
  return (
    <div ref={ref} className="relative w-full max-w-[820px] mx-auto">
      <div ref={slots.bar} className="relative rounded-[18px] md:rounded-[22px] ms-glass p-2 md:p-2.5 flex flex-col gap-2 min-w-0">
        {/* Top row */}
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            className="grid place-items-center w-8 h-8 md:w-9 md:h-9 self-start mt-1 rounded-lg ms-chip-glass text-foreground shrink-0"
            tabIndex={-1}
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.5} />
          </button>

          {/* Prompt area — slots only, no textarea here */}
          <div className="flex-1 min-w-0 flex items-center gap-2 py-1 pr-1">
            {/* Video slot — video1 docks here */}
            <div
              ref={slots.videoSlot}
              className="relative w-14 h-14 md:w-[88px] md:h-[88px] rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden shrink-0"
            />
            {/* Product / image2 slot */}
            <motion.div
              ref={slots.productSlot}
              style={{ opacity: productOpacity }}
              className="relative w-14 h-14 md:w-[88px] md:h-[88px] rounded-xl bg-white/[0.04] border border-white/10 overflow-hidden shrink-0"
            >
              <img src={PRODUCT_IMG_SRC} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/85 to-transparent" />
              <span className="absolute bottom-1 left-1 right-1 text-[10px] font-medium text-white/95 truncate">
                @image_2
              </span>
            </motion.div>
          </div>

          {/* Right column: Avatar (desktop only) + Generate (always shown) */}
          <div className="flex items-stretch gap-1.5 md:gap-2 self-start">
            {/* Avatar — desktop only */}
            <div className="hidden md:flex ms-glass-2 flex-col items-center justify-center w-[88px] h-[88px] rounded-2xl text-[10px] font-semibold text-foreground/90 overflow-hidden relative tracking-wider">
              <div className="grid place-items-center w-7 h-7 rounded-full bg-white/10 mb-1.5">
                <Plus className="w-4 h-4 text-foreground/90" strokeWidth={1.5} />
              </div>
              <span>AVATAR</span>
            </div>
            {/* Generate — always visible, responsive size */}
            <motion.div
              ref={slots.generate}
              animate={{ scale: generatePressed ? 0.94 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="relative"
            >
              <LpGradientCTA
                showSparkles
                className="w-[110px] h-14 md:w-[170px] md:h-[88px] rounded-xl md:rounded-2xl text-[9px] md:text-[12px] font-extrabold tracking-wide md:tracking-wider"
              >
                {generating ? "GENERATING…" : "GENERATE"}
              </LpGradientCTA>
            </motion.div>
          </div>
        </div>

        {/* Textarea — full width row so text uses all available space */}
        <div
          ref={slots.textarea}
          className="min-h-[40px] md:min-h-[52px] max-h-[120px] w-full bg-transparent text-[13px] md:text-sm leading-[1.6] text-foreground px-1 py-1 select-none"
        >
          <Typewriter text={promptText} progress={typingProgress} />
        </div>

        {/* Chip row — wraps gracefully on mobile */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap pl-1">
          <Chip>UGC</Chip>
          <Chip><Smartphone className="w-3 h-3 md:w-3.5 md:h-3.5" /> 9:16</Chip>
          <Chip className="hidden sm:flex"><Gem className="w-3 h-3 md:w-3.5 md:h-3.5" /> 720p</Chip>
          <Chip><Clock className="w-3 h-3 md:w-3.5 md:h-3.5" /> 8s</Chip>
          <Chip className="hidden sm:flex"><Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> Sound on</Chip>
        </div>

      </div>
    </div>
  );
});

function Chip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`ms-chip-glass flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3.5 h-8 md:h-9 rounded-full text-[11px] md:text-xs text-foreground ${className}`}>
      <span className="text-muted-foreground inline-flex items-center gap-1 md:gap-1.5">{children}</span>
      <ChevronDown className="size-3 md:size-3.5 text-muted-foreground/70" />
    </span>
  );
}
