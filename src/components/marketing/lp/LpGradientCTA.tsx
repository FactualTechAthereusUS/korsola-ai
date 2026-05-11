import { Sparkles } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  showSparkles?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
};

/**
 * Shared violet gradient pill CTA used in LpHero and the LpEditScene's
 * "Generate" button. Single source of truth so both stay in sync.
 */
export function LpGradientCTA({
  children,
  href,
  onClick,
  className = "",
  showSparkles = true,
  type = "button",
  disabled = false,
}: Props) {
  const cls = `group relative inline-flex items-center justify-center gap-2 h-12 w-[220px] rounded-full text-[15px] font-semibold text-white whitespace-nowrap overflow-hidden border border-white/40 bg-gradient-to-b from-[#cfc4ff] via-[#8b7bff] to-[#4f3bd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(40,20,120,0.5),0_10px_30px_rgba(99,58,232,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(40,20,120,0.6),0_14px_38px_rgba(99,58,232,0.7)] transition-all duration-300 ${className}`;
  const inner = (
    <>
      <span className="absolute top-0 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
      <span className="relative drop-shadow-[0_1px_1px_rgba(40,20,120,0.4)]">{children}</span>
      {showSparkles && (
        <Sparkles className="relative w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
      )}
    </>
  );
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${cls} disabled:opacity-60`}>
      {inner}
    </button>
  );
}
