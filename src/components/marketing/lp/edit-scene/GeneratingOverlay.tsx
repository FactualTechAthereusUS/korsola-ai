import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function GeneratingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 grid place-items-center z-30 rounded-[22px] bg-black/55 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 px-5 h-11 rounded-full bg-white/10 border border-white/20 text-white">
        <span className="relative grid place-items-center w-5 h-5">
          <span className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </span>
        <span className="text-[13px] font-semibold tracking-wide">Generating…</span>
        <Sparkles className="w-4 h-4 text-white/90" />
      </div>
    </motion.div>
  );
}
