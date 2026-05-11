import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  once?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 48,
  blur = 8,
  duration = 0.9,
  once = true,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as any)}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
};

export function RevealStagger({ children, ...rest }: { children: ReactNode } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as any)}>{children}</div>;
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...rest }: { children: ReactNode } & HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as any)}>{children}</div>;
  return (
    <motion.div variants={itemVariants} {...rest}>
      {children}
    </motion.div>
  );
}
