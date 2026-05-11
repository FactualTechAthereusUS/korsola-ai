import { useEffect, useRef, useState } from "react";
import { VideoReel } from "./VideoReel";

const REELS = Array.from({ length: 23 }, (_, i) => ({
  src: `/videos/reels/v${i + 1}.mp4`,
}));

export function LpReelCarousel() {
  const doubled = [...REELS, ...REELS];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const dragRef = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  // Auto-scroll loop with seamless wrap (since list is doubled)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speed = 40; // px per second
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!paused && !dragRef.current.active) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft + speed * dt;
        if (next >= half) next -= half;
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    const el = scrollerRef.current;
    if (!d.active || !el) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 3) d.moved = true;
    let next = d.startScroll - dx;
    const half = el.scrollWidth / 2;
    if (next < 0) next += half;
    if (next >= half) next -= half;
    el.scrollLeft = next;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current.active = false;
  };


  const stats = [
    { n: "1.2M+", l: "Ads generated" },
    { n: "18K+", l: "DTC brands" },
    { n: "$30M+", l: "Ad spend powered" },
  ];

  return (
    <section className="bg-bone py-16 md:py-24 overflow-hidden bg-white mt-0 pt-[30px]">
      {/* Marquee */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
        >
          <div className="flex gap-4 px-4 w-max">
            {doubled.map((r, i) => (
              <div key={i} className="w-[240px] md:w-[300px] shrink-0 pointer-events-none">
                <VideoReel src={r.src} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bone to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bone to-transparent pointer-events-none" />
      </div>

    </section>
  );
}
