import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const EXCLUDED = ["/create", "/spaces", "/spaces-projects", "/marketingstudio", "/video", "/generator", "/image"];

export function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (EXCLUDED.some((p) => pathname.startsWith(p))) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handlePause = () => lenis.stop();
    const handleResume = () => lenis.start();
    window.addEventListener("korsola:lenis-pause", handlePause);
    window.addEventListener("korsola:lenis-resume", handleResume);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener("korsola:lenis-pause", handlePause);
      window.removeEventListener("korsola:lenis-resume", handleResume);
    };
  }, [pathname]);

  return null;
}
