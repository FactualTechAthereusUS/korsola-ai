import { type ReactNode } from "react";
import { Sparkles } from "lucide-react";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  showSparkles?: boolean;
  size?: "sm" | "md" | "lg";
  videoSrc?: string;
};

export function GradientCTAButton({
  children,
  href,
  onClick,
  className = "",
  showSparkles = true,
  size = "md",
  videoSrc,
}: Props) {
  const sizes = {
    sm: "h-9 px-4 text-[13px]",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-[15px]",
  };
  const base = videoSrc
    ? "relative overflow-hidden border border-white/20 shadow-lg"
    : "mk-cta";
  const cls = `${base} inline-flex items-center gap-2 rounded-full font-semibold text-white whitespace-nowrap ${sizes[size]} ${className}`;
  const inner = (
    <>
      {videoSrc && (
        <>
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-0"
          />
          <span className="absolute inset-0 bg-black/20 -z-0" />
        </>
      )}
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{children}</span>
      {showSparkles && <Sparkles className="relative z-10 w-4 h-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />}
    </>
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  className = "",
  videoSrc,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  videoSrc?: string;
}) {
  const base = videoSrc
    ? "relative overflow-hidden text-white border border-white/20 shadow-lg"
    : "text-ink border border-ink/15 bg-white hover:bg-ink/5";
  const cls = `inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-semibold transition-colors ${base} ${className}`;
  const inner = videoSrc ? (
    <>
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-0"
      />
      <span className="absolute inset-0 bg-black/20 -z-0" />
      <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{children}</span>
    </>
  ) : (
    children
  );
  if (href)
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  return <button className={cls}>{inner}</button>;
}
