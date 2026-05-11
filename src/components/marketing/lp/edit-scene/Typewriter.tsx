import { MotionValue, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

type Props = {
  text: string;
  /** 0 → 1 progress through the typing window */
  progress: MotionValue<number>;
};

export function Typewriter({ text, progress }: Props) {
  const [count, setCount] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    const target = Math.round(clamped * text.length);
    setCount(target);
  });

  const shown = text.slice(0, count);
  const showCaret = count < text.length;

  return (
    <span className="text-[15px] leading-[1.6] text-foreground/95"
      style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}>
      {shown}
      {showCaret && (
        <span className="inline-block w-[2px] h-[1em] -mb-[2px] ml-[1px] bg-white/80 animate-pulse align-middle" />
      )}
    </span>
  );
}
