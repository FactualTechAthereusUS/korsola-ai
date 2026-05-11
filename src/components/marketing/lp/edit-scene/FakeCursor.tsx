import { motion, MotionValue } from "framer-motion";

type Props = {
  x: MotionValue<number> | number;
  y: MotionValue<number> | number;
  opacity?: MotionValue<number> | number;
  pressed?: MotionValue<number> | number;
};

export function FakeCursor({ x, y, opacity = 1, pressed = 0 }: Props) {
  return (
    <motion.div
      className="absolute top-0 left-0 pointer-events-none z-[60]"
      style={{ x, y, opacity }}
    >
      <motion.svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        style={{ scale: typeof pressed === "number" ? 1 - pressed * 0.15 : undefined }}
        className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
      >
        <path
          d="M2 2 L2 21 L7.5 16 L11 24 L13.5 23 L10 15 L17 14 Z"
          fill="white"
          stroke="#0f0f10"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </motion.svg>
    </motion.div>
  );
}
