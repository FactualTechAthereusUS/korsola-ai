import { VolumeX } from "lucide-react";

type Props = {
  gradient: string;
  caption?: string;
  tag?: string;
  className?: string;
  rotate?: number;
};

export function ReelCard({
  gradient,
  caption,
  tag = "AI GENERATED",
  className = "",
  rotate = 0,
}: Props) {
  return (
    <div
      className={`lp-reel aspect-[9/16] shrink-0 ${className}`}
      style={{ background: gradient, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {/* faint subject silhouette */}
      <div
        className="absolute inset-0 opacity-50 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 35%, rgba(255,255,255,0.45), transparent 60%), radial-gradient(70% 50% at 50% 90%, rgba(0,0,0,0.35), transparent 60%)",
        }}
      />
      {tag && (
        <span className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded bg-white/70 backdrop-blur text-[9px] font-bold tracking-wider uppercase text-black/80">
          {tag}
        </span>
      )}
      <span className="absolute top-2 right-2 z-10 grid place-items-center w-6 h-6 rounded-full bg-black/40 text-white/90">
        <VolumeX className="w-3 h-3" />
      </span>
      {caption && (
        <span className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/45 backdrop-blur text-white text-[11px] font-semibold text-center max-w-[90%] leading-tight">
          {caption}
        </span>
      )}
    </div>
  );
}
