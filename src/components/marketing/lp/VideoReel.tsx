import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

type Props = {
  src: string;
  caption?: string;
  className?: string;
  poster?: string;
};

export function VideoReel({ src, caption, className = "", poster }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inView, setInView] = useState(false);

  // Mount video only when near viewport (load), play only when actually visible.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      setInView(true);
      return;
    }
    const loadIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            loadIO.disconnect();
            break;
          }
        }
      },
      { rootMargin: "400px" },
    );
    const playIO = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { threshold: 0.25 },
    );
    loadIO.observe(el);
    playIO.observe(el);
    return () => {
      loadIO.disconnect();
      playIO.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, shouldLoad]);

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-[9/16] shrink-0 rounded-2xl overflow-hidden bg-black shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] ${className}`}
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <span className="absolute top-2 right-2 z-10 grid place-items-center w-7 h-7 rounded-full bg-white/85 backdrop-blur text-black/80 shadow">
        <VolumeX className="w-3.5 h-3.5" />
      </span>
      {caption && (
        <span className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-black/40 backdrop-blur-sm text-white text-[12px] font-semibold text-center max-w-[92%] leading-tight drop-shadow">
          {caption}
        </span>
      )}
    </div>
  );
}
