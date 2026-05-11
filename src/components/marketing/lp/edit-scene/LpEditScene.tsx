import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { PromptBarMock, type SlotRefs } from "./PromptBarMock";
import { FakeCursor } from "./FakeCursor";
import { PROMPT_TEXT, VIDEO_1_SRC, VIDEO_3_SRC } from "./scene-assets";

type Rect = { x: number; y: number; w: number; h: number };
const ZERO: Rect = { x: 0, y: 0, w: 0, h: 0 };

function clamp(v: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Centered 9:16 portrait — responsive: smaller on mobile so heading + bar fit. */
function centerRect(stageW: number, stageH: number): Rect {
  // Reserve less vertical space at the top on small screens
  const topReserved = stageW < 640 ? 190 : stageW < 1024 ? 215 : 260;
  // Cap video height so it doesn't crowd the bar
  const maxH = stageW < 640 ? 460 : stageW < 1024 ? 540 : 620;
  const available = stageH - topReserved - 48;
  const h = Math.min(available, maxH);
  const w = (h * 9) / 16;
  const y = topReserved;
  const x = (stageW - w) / 2;
  return { x, y, w, h };
}

// ---- Scroll choreography ----
// 0.00 → 0.06   heading only, white bg, no video
// 0.06 → 0.18   video1 fades in at center
// 0.18 → latch  HOLD: video1 plays 11s, bar hidden
// playedAt → +0.12  video1 shrinks into slot, bg darkens, bar fades in
// lp 0.18→0.34  cursor enters with Chanel image
// lp 0.50→0.66  prompt types
// lp 0.66→0.74  cursor moves to Generate
// lp 0.74        Generate pressed → queue card appears instantly, bar fades + slides up
// lp 0.74→0.94  bar + video1 + queue card all slide up together; bar fades out
// lp 0.94+      video3 appears, Lenis pauses until done
const VIDEO_IN = [0.06, 0.18];
const ACT4_IN = 0.94;
const ACT4_OUT = 1.0;

export function LpEditScene() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Shorter section on mobile = animation plays faster through scroll
  const [sectionHeight, setSectionHeight] = useState("2000vh");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSectionHeight(w < 640 ? "1300vh" : w < 1024 ? "1700vh" : "2000vh");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const barWrapRef = useRef<HTMLDivElement>(null);
  const v1Ref = useRef<HTMLVideoElement>(null);

  const slots: SlotRefs = {
    bar: useRef<HTMLDivElement>(null),
    videoSlot: useRef<HTMLDivElement>(null),
    productSlot: useRef<HTMLDivElement>(null),
    textarea: useRef<HTMLDivElement>(null),
    generate: useRef<HTMLDivElement>(null),
  };

  type Measured = {
    stage: { w: number; h: number };
    center: Rect;
    videoSlot: Rect;
    productSlot: Rect;
    textarea: Rect;
    generate: Rect;
    barNaturalBottom: number; // natural Y of bar's bottom edge (no barY applied)
  };
  const [m, setM] = useState<Measured>({
    stage: { w: 0, h: 0 },
    center: ZERO,
    videoSlot: ZERO,
    productSlot: ZERO,
    textarea: ZERO,
    generate: ZERO,
    barNaturalBottom: 0,
  });

  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const barWrap = barWrapRef.current;
      if (!stage) return;
      const sr = stage.getBoundingClientRect();

      // Analytical measurement for bar-relative slots.
      // getBoundingClientRect() on bar elements would include the current barY transform,
      // giving wrong positions when measured mid-animation. Instead:
      //   • barNaturalTop = stageH/2 - barH/2  (bar's layout center, no barY)
      //   • slotOffset = slot.top - barWrap.top  (transform-invariant: both shift by barY equally)
      const barH = barWrap ? barWrap.getBoundingClientRect().height : 0;
      const barNaturalTop = sr.height / 2 - barH / 2;
      const barNaturalBottom = sr.height / 2 + barH / 2;

      const barRectFor = (el: HTMLElement | null): Rect => {
        if (!el || !barWrap) return ZERO;
        const br = barWrap.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return {
          x: r.left - sr.left,                  // bar has no X transform, safe to measure directly
          y: barNaturalTop + (r.top - br.top),  // natural bar top + offset within bar
          w: r.width,
          h: r.height,
        };
      };

      const next: Measured = {
        stage: { w: sr.width, h: sr.height },
        center: centerRect(sr.width, sr.height),
        videoSlot: barRectFor(slots.videoSlot.current),
        productSlot: barRectFor(slots.productSlot.current),
        textarea: barRectFor(slots.textarea.current),
        generate: barRectFor(slots.generate.current),
        barNaturalBottom,
      };
      setM((prev) => {
        if (
          prev.stage.w === next.stage.w &&
          prev.stage.h === next.stage.h &&
          prev.videoSlot.x === next.videoSlot.x &&
          prev.videoSlot.y === next.videoSlot.y &&
          prev.productSlot.x === next.productSlot.x &&
          prev.generate.x === next.generate.x &&
          prev.barNaturalBottom === next.barNaturalBottom
        )
          return prev;
        return next;
      });
    };
    measure();
    const t1 = window.setTimeout(measure, 60);
    const t2 = window.setTimeout(measure, 240);
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    if (barWrapRef.current) ro.observe(barWrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  // --- scroll progress ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothP = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 35,
    restDelta: 0.0003,
  });
  const p = smoothP;

  // --- Video1 playback control ---
  const [v1Started, setV1Started] = useState(false);
  const [played, setPlayed] = useState(false);
  const [playedAtP, setPlayedAtP] = useState<number | null>(null);

  // Video3 sticky play
  const v3Ref = useRef<HTMLVideoElement>(null);
  const v3TimerRef = useRef<number | null>(null);
  const [v3Playing, setV3Playing] = useState(false);
  const [v3Done, setV3Done] = useState(false);
  const playTimerRef = useRef<number | null>(null);

  // Video1 controls (large center view only — before docking)
  const [v1Muted, setV1Muted] = useState(true);
  const [v1Paused, setV1Paused] = useState(false);
  const [v1Hovered, setV1Hovered] = useState(false);

  const toggleV1Mute = () => {
    setV1Muted((prev) => {
      const next = !prev;
      if (v1Ref.current) v1Ref.current.muted = next;
      return next;
    });
  };

  const toggleV1Play = () => {
    setV1Paused((prev) => {
      const next = !prev;
      if (v1Ref.current) {
        if (next) {
          // User manually paused — stop timer, unlock scroll, latch so animation continues
          v1Ref.current.pause();
          if (playTimerRef.current) window.clearTimeout(playTimerRef.current);
          window.dispatchEvent(new CustomEvent("korsola:lenis-resume"));
          latchPlayed();
        } else {
          v1Ref.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  // Video3 controls
  const [v3Muted, setV3Muted] = useState(true);
  const [v3Paused, setV3Paused] = useState(false);
  const [v3Hovered, setV3Hovered] = useState(false);

  const toggleV3Mute = () => {
    setV3Muted((prev) => {
      const next = !prev;
      if (v3Ref.current) v3Ref.current.muted = next;
      return next;
    });
  };

  const toggleV3Play = () => {
    setV3Paused((prev) => {
      const next = !prev;
      if (v3Ref.current) {
        if (next) {
          v3Ref.current.pause();
          // unlock scroll so user can swipe away naturally
          window.dispatchEvent(new CustomEvent("korsola:lenis-resume"));
        } else {
          v3Ref.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const latchV3Done = () => {
    setV3Done((was) => {
      if (was) return was;
      if (v3TimerRef.current) window.clearTimeout(v3TimerRef.current);
      window.dispatchEvent(new CustomEvent("korsola:lenis-resume"));
      return true;
    });
  };

  const latchPlayed = () => {
    setPlayed((wasPlayed) => {
      if (wasPlayed) return wasPlayed;
      setPlayedAtP(p.get());
      const el = v1Ref.current;
      if (el) el.pause();
      // Unlock scroll so user can continue after video finishes
      window.dispatchEvent(new CustomEvent("korsola:lenis-resume"));
      return true;
    });
  };

  useMotionValueEvent(p, "change", (v) => {
    if (v >= VIDEO_IN[1] && !v1Started) {
      setV1Started(true);
      const el = v1Ref.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => {});
      }
      // Lock scroll for 11s while video1 plays
      window.dispatchEvent(new CustomEvent("korsola:lenis-pause"));
      if (playTimerRef.current) window.clearTimeout(playTimerRef.current);
      playTimerRef.current = window.setTimeout(latchPlayed, 11000);
    }

    // Reset when scrolled fully back
    if (v < 0.04 && (v1Started || played)) {
      if (playTimerRef.current) window.clearTimeout(playTimerRef.current);
      setV1Started(false);
      setPlayed(false);
      setPlayedAtP(null);
      const el = v1Ref.current;
      if (el) { el.pause(); el.currentTime = 0; }
      if (v3TimerRef.current) window.clearTimeout(v3TimerRef.current);
      setV3Playing(false);
      setV3Done(false);
      const v3el = v3Ref.current;
      if (v3el) { v3el.pause(); v3el.currentTime = 0; }
      window.dispatchEvent(new CustomEvent("korsola:lenis-resume"));
    }
  });

  useEffect(() => {
    const el = v1Ref.current;
    if (!el) return;
    const onTime = () => { if (!played && el.currentTime >= 11) latchPlayed(); };
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [played]);

  // lp: normalized scroll after video1 finishes — spans 0→1 regardless of playedAtP
  const PA = playedAtP ?? 0;
  const lp = (v: number) => {
    const remain = 1 - PA;
    if (remain <= 0.0001) return 1;
    return clamp((v - PA) / remain);
  };

  // --- BACKGROUND: white → dark ---
  const bgColor = useTransform(p, (v) => {
    if (!played || playedAtP == null) return "rgb(255,255,255)";
    const t = clamp((v - playedAtP) / 0.08);
    return `rgb(${Math.round(lerp(255, 11, t))},${Math.round(lerp(255, 11, t))},${Math.round(lerp(255, 12, t))})`;
  });

  // ---- BAR Y: slides up at generate (lp=0.74), then further at complete (lp=0.94) ----
  // Everything that "moves with the bar" uses this exact formula.
  const barY = useTransform(p, (v) => {
    if (!played) return 0;
    const l = lp(v);
    const clearT = clamp((l - 0.74) / 0.12);
    const clearY = lerp(0, -(m.stage.h * 0.22), clearT);
    const exitT = clamp((l - ACT4_IN) / (ACT4_OUT - ACT4_IN));
    const exitY = lerp(0, -220, exitT);
    return clearY + exitY;
  });

  const barExitOpacity = useTransform(p, (v) => {
    if (!played) return 0;
    const l = lp(v);
    const fadeIn = clamp((l - 0.02) / 0.08);
    // Fades out starting at generate press (lp=0.74), fully gone by lp=0.88
    const fadeOut = clamp((l - 0.74) / 0.14);
    return fadeIn * (1 - fadeOut);
  });

  const barScale = useTransform(p, (v) => {
    if (!played) return 1;
    const t = clamp((lp(v) - ACT4_IN) / (ACT4_OUT - ACT4_IN));
    return lerp(1, 0.92, t);
  });

  // ---- VIDEO 1 transforms ----
  // Before played: centered on stage (fades in).
  // After played: shrinks into slot over lp 0→0.12, then tracks bar motion exactly.
  const SHRINK = 0.12;

  const v1X = useTransform(p, (v) => {
    if (!played || playedAtP == null) return m.center.x;
    const t = clamp((v - playedAtP) / SHRINK);
    return lerp(m.center.x, m.videoSlot.x, t);
  });

  const v1Y = useTransform(p, (v) => {
    if (!played || playedAtP == null) return m.center.y;
    const dockT = clamp((v - playedAtP) / SHRINK);
    const dockedBase = lerp(m.center.y, m.videoSlot.y, dockT);
    // When fully docked, track the EXACT same motion as the bar (clearY + exitY)
    const l = lp(v);
    const clearT = clamp((l - 0.74) / 0.12);
    const clearY = lerp(0, -(m.stage.h * 0.22), clearT);
    const exitT = clamp((l - ACT4_IN) / (ACT4_OUT - ACT4_IN));
    const exitY = lerp(0, -220, exitT);
    return dockedBase + dockT * (clearY + exitY);
  });

  const v1W = useTransform(p, (v) => {
    if (!played || playedAtP == null) return m.center.w;
    const t = clamp((v - playedAtP) / SHRINK);
    return lerp(m.center.w, m.videoSlot.w || 88, t);
  });

  const v1H = useTransform(p, (v) => {
    if (!played || playedAtP == null) return m.center.h;
    const t = clamp((v - playedAtP) / SHRINK);
    return lerp(m.center.h, m.videoSlot.h || 88, t);
  });

  const v1Radius = useTransform(p, (v) => {
    if (!played || playedAtP == null) return 22;
    const t = clamp((v - playedAtP) / SHRINK);
    return lerp(22, 12, t);
  });

  const v1Opacity = useTransform(p, (v) => {
    const fadeIn = clamp((v - VIDEO_IN[0]) / (VIDEO_IN[1] - VIDEO_IN[0]));
    if (!played || playedAtP == null) return fadeIn;
    const dockT = clamp((v - playedAtP) / SHRINK);
    // Once docked, fade with the bar (same exit formula)
    if (dockT >= 1) {
      const l = lp(v);
      const fadeOut = clamp((l - 0.74) / 0.14);
      return 1 - fadeOut;
    }
    return fadeIn;
  });

  // "existing video" label fades out as docking starts
  const labelOpacity = useTransform(p, (v) => {
    const inT = clamp((v - VIDEO_IN[0]) / (VIDEO_IN[1] - VIDEO_IN[0]));
    if (!played || playedAtP == null) return inT;
    const outT = clamp((v - playedAtP) / 0.04);
    return inT * (1 - outT);
  });

  // "@Video1" chip label — fades in once fully docked
  const v1ChipLabelOpacity = useTransform(p, (v) => {
    if (!played || playedAtP == null) return 0;
    return clamp((lp(v) - 0.12) / 0.04);
  });

  // ---- CURSOR ----
  const cursorOpacity = useTransform(p, (v) => {
    if (!played || playedAtP == null) return 0;
    // Don't start until video1 is fully docked into the slot
    const dockT = clamp((v - playedAtP) / SHRINK);
    if (dockT < 1) return 0;
    const l = lp(v);
    if (l < 0.18 || l > 0.78) return 0;
    return 1;
  });
  const cursorX = useTransform(p, (v) => {
    if (!played) return 0;
    const l = lp(v);
    const stageW = m.stage.w;
    if (l < 0.18) return stageW + 80;
    if (l < 0.34) return lerp(stageW + 80, m.productSlot.x + m.productSlot.w / 2, clamp((l - 0.18) / 0.16));
    if (l < 0.50) return lerp(m.productSlot.x + m.productSlot.w / 2, m.textarea.x + 24, clamp((l - 0.36) / 0.14));
    if (l < 0.74) return lerp(m.textarea.x + 24, m.generate.x + m.generate.w / 2, clamp((l - 0.66) / 0.08));
    return m.generate.x + m.generate.w / 2;
  });
  const cursorY = useTransform(p, (v) => {
    if (!played) return 0;
    const l = lp(v);
    if (l < 0.18) return m.stage.h * 0.55;
    if (l < 0.34) return lerp(m.stage.h * 0.55, m.productSlot.y + m.productSlot.h / 2, clamp((l - 0.18) / 0.16));
    if (l < 0.50) return lerp(m.productSlot.y + m.productSlot.h / 2, m.textarea.y + 18, clamp((l - 0.36) / 0.14));
    if (l < 0.74) return lerp(m.textarea.y + 18, m.generate.y + m.generate.h / 2, clamp((l - 0.66) / 0.08));
    return m.generate.y + m.generate.h / 2;
  });

  // Chanel image rides with cursor
  const chanelOpacity = useTransform(p, (v) => {
    if (!played || playedAtP == null) return 0;
    // Don't start until video1 is fully docked into the slot
    const dockT = clamp((v - playedAtP) / SHRINK);
    if (dockT < 1) return 0;
    const l = lp(v);
    if (l < 0.18 || l > 0.345) return 0;
    return 1;
  });
  const chanelX = useTransform(p, () => cursorX.get() - 32);
  const chanelY = useTransform(p, () => cursorY.get() - 32);

  // Product slot icon once dropped
  const productOpacity = useTransform(p, (v) => {
    if (!played) return 0;
    return clamp((lp(v) - 0.335) / 0.02);
  });

  // Typewriter
  const typingProgress = useTransform(p, (v) => {
    if (!played) return 0;
    return clamp((lp(v) - 0.50) / 0.16);
  });

  // Generate press flash
  const [pressed, setPressed] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    if (!played) return setPressed(false);
    const l = lp(v);
    setPressed(l >= 0.74 && l < 0.77);
  });

  // ---- QUEUE CARD + COMPLETE ----
  // Queue card appears IMMEDIATELY when generate is pressed (lp=0.74).
  // Both bar + queue card + video1 slide up together via barY.
  const [generating, setGenerating] = useState(false);
  const [complete, setComplete] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    if (!played) {
      setGenerating(false);
      setComplete(false);
      return;
    }
    const l = lp(v);
    setGenerating(l >= 0.74 && l < ACT4_IN);
    setComplete(l >= ACT4_IN);
  });

  // Start video3 once complete
  useEffect(() => {
    if (complete && !v3Playing && !v3Done) {
      setV3Playing(true);
      const el = v3Ref.current;
      if (el) {
        el.currentTime = 0;
        el.play().catch(() => {});
      }
      window.dispatchEvent(new CustomEvent("korsola:lenis-pause"));
      v3TimerRef.current = window.setTimeout(latchV3Done, 13000);
    }
  }, [complete]);

  // ---------------------- REDUCED MOTION FALLBACK ----------------------
  if (reduce) {
    return (
      <section className="bg-white text-ink py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-extrabold tracking-tight text-3xl md:text-5xl leading-[1.05] text-ink">
            Edit any video with{" "}
            <span className="font-serif italic font-normal">a sentence</span>.
          </h2>
          <video
            src={VIDEO_3_SRC}
            autoPlay
            muted
            loop
            playsInline
            className="mt-10 w-full max-w-md mx-auto aspect-[9/16] object-cover rounded-2xl"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-edit-scene
      className="relative"
      style={{ height: sectionHeight }}
    >
        <motion.div
          ref={stageRef}
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {/* HEADING */}
          <div className="absolute inset-x-0 top-[2%] sm:top-[3%] md:top-[4%] lg:top-[5%] z-30 px-4 sm:px-6 text-center pointer-events-none">
            <h2 className="font-display font-extrabold tracking-tight text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.02] text-ink">
              Edit any video with{" "}
              <span className="font-serif italic font-normal">a sentence</span>.
            </h2>
            <p className="mt-1.5 md:mt-2 text-[12px] sm:text-[14px] md:text-[15px] max-w-xl mx-auto text-ink/60">
              Drop a clip. Add a product. Type the change. Korsola handles the rest.
            </p>
          </div>

          {/* "existing video" label */}
          <motion.div
            className="absolute z-20 pointer-events-none text-center"
            style={{
              left: m.center.x,
              top: Math.max(148, m.center.y - 34),
              width: m.center.w,
              opacity: labelOpacity,
            }}
          >
            <span className="font-serif italic text-ink/70 text-[15px] md:text-[18px] lg:text-[20px] tracking-tight">
              existing video
            </span>
          </motion.div>

          {/* QUEUE CARD — below the bar, slides with barY, never overlaps bar */}
          {generating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute overflow-hidden z-[15] bg-[#0f0f10] border border-white/10 grid place-items-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              style={{
                left: m.center.x,
                top: m.barNaturalBottom + 20,
                width: m.center.w,
                height: Math.max(160, m.center.y + m.center.h - m.barNaturalBottom - 20),
                borderRadius: 18,
                y: barY,
              }}
            >
              <div className="flex flex-col items-center gap-3 text-white/85">
                <span className="relative grid place-items-center w-9 h-9">
                  <span className="absolute inset-0 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                </span>
                <span className="text-[12px] font-semibold tracking-[0.18em] uppercase">In queue · Generating</span>
                <span className="text-[11px] text-white/55">UGC · 9:16 · 720p · 8s</span>
              </div>
            </motion.div>
          )}

          {/* VIDEO 3 — state-driven opacity (scroll frozen by Lenis pause) */}
          {complete && (
            <>
              {/* Label above video3 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="absolute z-[9] pointer-events-none text-center"
                style={{
                  left: m.center.x,
                  top: Math.max(148, m.center.y - 38),
                  width: m.center.w,
                }}
              >
                <span className="font-serif italic text-white/75 text-[15px] md:text-[18px] lg:text-[20px] tracking-tight">
                  here's your edited video
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="absolute bg-black z-[8] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
                style={{
                  left: m.center.x,
                  top: m.center.y,
                  width: m.center.w,
                  height: m.center.h,
                  borderRadius: 18,
                  overflow: "hidden",
                }}
                onMouseEnter={() => setV3Hovered(true)}
                onMouseLeave={() => setV3Hovered(false)}
                onTouchStart={() => {
                  setV3Hovered(true);
                  window.setTimeout(() => setV3Hovered(false), 2200);
                }}
              >
                {/* Video */}
                <video
                  ref={v3Ref}
                  src={VIDEO_3_SRC}
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  onEnded={latchV3Done}
                />

                {/* ── Mute toggle — top right ── */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  onClick={toggleV3Mute}
                  className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-white/90 hover:opacity-100 hover:bg-black/60 hover:text-white transition-all duration-200"
                  aria-label={v3Muted ? "Unmute" : "Mute"}
                >
                  {v3Muted
                    ? <VolumeX className="w-4 h-4" strokeWidth={1.8} />
                    : <Volume2 className="w-4 h-4" strokeWidth={1.8} />
                  }
                </motion.button>

                {/* ── Play / Pause — dead center ── */}
                {/* x/y via Framer Motion style so they compose correctly with scale/opacity */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
                  animate={{
                    opacity: v3Paused || v3Hovered ? 1 : 0,
                    scale: v3Hovered || v3Paused ? 1 : 0.85,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={toggleV3Play}
                  className="absolute top-1/2 left-1/2 z-10 grid place-items-center w-14 h-14 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white"
                  aria-label={v3Paused ? "Play" : "Pause"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {v3Paused ? (
                      <motion.span
                        key="play"
                        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="grid place-items-center"
                      >
                        <Play className="w-5 h-5 fill-white translate-x-[1px]" strokeWidth={0} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pause"
                        initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: -10 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="grid place-items-center"
                      >
                        <Pause className="w-5 h-5 fill-white" strokeWidth={0} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </>
          )}

          {/* PROMPT BAR — fades out + slides up starting at lp=0.74 */}
          <motion.div
            ref={barWrapRef}
            className="absolute inset-x-0 top-1/2 z-[20] px-3 sm:px-5 md:px-6"
            style={{
              opacity: barExitOpacity,
              y: barY,
              scale: barScale,
              translateY: "-50%",
              transformOrigin: "center center",
            }}
          >
            <PromptBarMock
              slots={slots}
              promptText={PROMPT_TEXT}
              typingProgress={typingProgress}
              productOpacity={productOpacity}
              generating={generating}
              generatePressed={pressed}
            />
          </motion.div>

          {/* VIDEO 1 — floats at center until docked, then tracks bar exactly */}
          {/* z-[25]: renders above bar (z-[20]) while docking into the slot */}
          <motion.div
            className="absolute top-0 left-0 overflow-hidden bg-black z-[25] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
            style={{
              x: v1X,
              y: v1Y,
              width: v1W,
              height: v1H,
              borderRadius: v1Radius,
              opacity: v1Opacity,
            }}
            onMouseEnter={() => setV1Hovered(true)}
            onMouseLeave={() => setV1Hovered(false)}
            onTouchStart={() => {
              setV1Hovered(true);
              window.setTimeout(() => setV1Hovered(false), 2200);
            }}
          >
            <video
              ref={v1Ref}
              src={VIDEO_1_SRC}
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />

            {/* Controls — only visible before docking (played=false) */}
            {!played && (
              <>
                {/* Mute — top right — always subtly visible so touch users discover it */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: v1Hovered ? 1 : 0.55, scale: v1Hovered ? 1 : 0.9 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={toggleV1Mute}
                  className="absolute top-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-white/90 hover:bg-black/60 hover:text-white transition-colors duration-200"
                  aria-label={v1Muted ? "Unmute" : "Mute"}
                >
                  {v1Muted
                    ? <VolumeX className="w-4 h-4" strokeWidth={1.8} />
                    : <Volume2 className="w-4 h-4" strokeWidth={1.8} />
                  }
                </motion.button>

                {/* Play / Pause — dead center */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.85, x: "-50%", y: "-50%" }}
                  animate={{
                    opacity: v1Paused || v1Hovered ? 1 : 0,
                    scale: v1Hovered || v1Paused ? 1 : 0.85,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={toggleV1Play}
                  className="absolute top-1/2 left-1/2 z-10 grid place-items-center w-14 h-14 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white"
                  aria-label={v1Paused ? "Play" : "Pause"}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {v1Paused ? (
                      <motion.span
                        key="play"
                        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: 10 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="grid place-items-center"
                      >
                        <Play className="w-5 h-5 fill-white translate-x-[1px]" strokeWidth={0} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="pause"
                        initial={{ opacity: 0, scale: 0.6, rotate: 10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.6, rotate: -10 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="grid place-items-center"
                      >
                        <Pause className="w-5 h-5 fill-white" strokeWidth={0} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </>
            )}

            <motion.div
              style={{ opacity: v1ChipLabelOpacity }}
              className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-black/85 to-transparent"
            />
            <motion.span
              style={{ opacity: v1ChipLabelOpacity }}
              className="absolute bottom-1 left-1.5 right-1.5 text-[11px] font-medium text-white/95 truncate pointer-events-none"
            >
              @video_1
            </motion.span>
          </motion.div>

          {/* CHANEL image being dragged in */}
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 rounded-xl overflow-hidden border border-white/30 shadow-2xl z-[55] pointer-events-none"
            style={{ x: chanelX, y: chanelY, opacity: chanelOpacity }}
          >
            <img src="/videos/edit-scene/chanel.jpg" alt="" className="w-full h-full object-cover" />
          </motion.div>

          {/* FAKE CURSOR */}
          <FakeCursor x={cursorX} y={cursorY} opacity={cursorOpacity} pressed={pressed ? 1 : 0} />

        </motion.div>
    </section>
  );
}
