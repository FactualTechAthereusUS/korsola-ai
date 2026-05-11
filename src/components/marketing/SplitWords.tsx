import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const wordAnim: Variants = {
  hidden: { y: "108%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.62, ease: EASE },
  },
};

type Props = {
  children: string;
  className?: string;
  style?: CSSProperties;
  /** seconds between each word */
  stagger?: number;
  /** initial delay before the first word starts */
  delay?: number;
};

/**
 * Splits a plain-text string into individual words, each masked and
 * stagger-revealed when the element enters the viewport.
 *
 * Usage inside a heading with mixed styles:
 *   <h2>
 *     <SplitWords>Plain text part</SplitWords>{" "}
 *     <SplitWords className="font-serif italic" delay={0.21}>italic part</SplitWords>
 *   </h2>
 */
export function SplitWords({ children, className, style, stagger = 0.07, delay = 0 }: Props) {
  const reduce = useReducedMotion();

  const words = String(children)
    .split(/\s+/)
    .filter(Boolean);

  if (reduce) {
    return <span className={className} style={style}>{children}</span>;
  }

  return (
    <motion.span
      className={className}
      style={{ display: "inline", ...style }}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-6% 0px -6% 0px" }}
      transition={{ delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            lineHeight: "inherit",
            verticalAlign: "bottom",
          }}
        >
          <motion.span variants={wordAnim} style={{ display: "inline-block" }}>
            {w}
          </motion.span>
          {/* non-breaking space between words to preserve natural spacing */}
          {i < words.length - 1 && " "}
        </span>
      ))}
    </motion.span>
  );
}
