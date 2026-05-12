import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GradientCTAButton } from "./GradientCTAButton";
import logoLight from "@/assets/logo-light.webp";
import logoDark from "@/assets/logo-dark.webp";

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/home", label: "How It Works", hash: "how" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function MarketingHeader({ overlay = false }: { overlay?: boolean } = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onLight = overlay; // dark pill on scroll => light text in both states
  const showSolid = !overlay || scrolled;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} left-0 right-0 z-40 transition-all duration-300 ${
        showSolid ? "top-3 px-3 sm:px-6" : "top-0"
      }`}
    >
      <div
        className={`mx-auto h-14 flex items-center justify-between transition-all duration-300 ${
          showSolid
            ? "max-w-6xl rounded-full bg-ink/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)] px-3 sm:px-4"
            : "max-w-7xl px-4 sm:px-6 h-16"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src={onLight ? logoLight : logoDark}
            alt="Korsola"
            className="w-8 h-8 object-contain"
          />
          <span className={`text-[15px] font-display font-extrabold tracking-[0.14em] ${onLight ? "text-white" : "text-ink"}`}>
            KORSOLA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV.map((n) => (
            <Link
              key={n.to + n.label}
              to={n.to}
              className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-colors ${onLight ? "text-white/85 hover:text-white hover:bg-white/10" : "text-ink-soft hover:text-ink hover:bg-ink/5"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/auth"
            className="group relative inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full text-[14px] font-semibold text-white whitespace-nowrap overflow-hidden border border-white/40 bg-gradient-to-b from-[#cfc4ff] via-[#8b7bff] to-[#4f3bd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(40,20,120,0.5),0_10px_30px_rgba(99,58,232,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(40,20,120,0.6),0_14px_38px_rgba(99,58,232,0.7)] transition-all duration-300"
          >
            <span className="absolute top-0 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            <span className="relative drop-shadow-[0_1px_1px_rgba(40,20,120,0.4)]">Login / Sign Up</span>
          </a>
        </div>
      </div>
    </header>
  );
}
