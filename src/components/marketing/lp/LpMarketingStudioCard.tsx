import { useEffect, useRef, useState } from "react";

const VIDEOS = [
  "/videos/actors/studio_1.mp4",
  "/videos/actors/studio_2.mp4",
  "/videos/actors/studio_3.mp4",
  "/videos/actors/studio_4.mp4",
  "/videos/actors/studio_5.mp4",
  "/videos/actors/studio_6.mp4",
];

export function LpMarketingStudioCard() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0); // px offset while dragging
  const dragRef = useRef<{ active: boolean; startX: number; moved: boolean }>({
    active: false,
    startX: 0,
    moved: false,
  });
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);

  const advance = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + VIDEOS.length) % VIDEOS.length);
  };

  // Auto-advance when center video ends
  const handleEnded = () => advance(1);

  useEffect(() => {
    const v = mainVideoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [index]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = { active: true, startX: e.clientX, moved: false };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    setDrag(dx);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    setDrag(0);
    const threshold = 60;
    if (dx <= -threshold) advance(1);
    else if (dx >= threshold) advance(-1);
    if ((e.currentTarget as HTMLDivElement).hasPointerCapture(e.pointerId)) {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    }
  };

  // visible window: prev, current, next
  const prev = (index - 1 + VIDEOS.length) % VIDEOS.length;
  const next = (index + 1) % VIDEOS.length;

  const slots: { src: string; pos: "left" | "center" | "right"; key: string }[] = [
    { src: VIDEOS[prev], pos: "left", key: `l-${prev}` },
    { src: VIDEOS[index], pos: "center", key: `c-${index}` },
    { src: VIDEOS[next], pos: "right", key: `r-${next}` },
  ];

  const isDragging = dragRef.current.active;

  return (
    <div
      className="rounded-3xl bg-[#0e0e10] border border-white/10 p-5 sm:p-7 w-full mx-auto flex flex-col md:min-h-[623px] md:max-w-[486px]"
    >
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] flex items-center justify-center">
          {slots.map(({ src, pos, key }) => {
            const isCenter = pos === "center";
            const basePx = pos === "left" ? -260 : pos === "right" ? 260 : 0;
            const offset = basePx + drag;
            // dynamic scale/opacity based on drag distance for smooth feel
            const dragRatio = Math.min(Math.abs(drag) / 260, 1);
            let scale = isCenter ? 1 : 0.82;
            let opacity = isCenter ? 1 : 0.55;
            if (isCenter) {
              scale = 1 - dragRatio * 0.18;
              opacity = 1 - dragRatio * 0.45;
            } else if (
              (pos === "left" && drag > 0) ||
              (pos === "right" && drag < 0)
            ) {
              scale = 0.82 + dragRatio * 0.18;
              opacity = 0.55 + dragRatio * 0.45;
            }
            return (
              <div
                key={key}
                className={isDragging ? "absolute" : "absolute transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"}
                style={{
                  transform: `translateX(${offset}px) scale(${scale})`,
                  zIndex: isCenter ? 20 : 10,
                  opacity,
                }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden bg-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] pointer-events-none"
                  style={{
                    width: isCenter ? 220 : 180,
                    aspectRatio: "9 / 16",
                  }}
                >
                  <video
                    ref={isCenter ? mainVideoRef : undefined}
                    src={src}
                    autoPlay
                    muted
                    loop={!isCenter}
                    playsInline
                    preload="auto"
                    onEnded={isCenter ? handleEnded : undefined}
                    className="w-full h-full object-cover"
                  />
                  {!isCenter && (
                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* dots */}
      <div className="mt-3 flex justify-center gap-1.5">
        {VIDEOS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-white/85" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-display font-extrabold text-white text-2xl">
          Marketing <span className="font-serif italic font-normal">studio</span>
        </h3>
        <p className="mt-2 text-white/60 text-[14px] leading-relaxed">
          No AI slop — generate realistic videos with Seedance 2.0 across every
          format you need: UGC, tutorial, unboxing, podcast, and more.
        </p>
      </div>
    </div>
  );
}
