import logoLight from "@/assets/logo-light.webp";

const COLS = [
  {
    title: "Platform",
    links: [
      "Marketing Studio",
      "Motion Control",
      "Seedance 2.0",
      "Image Studio",
      "Canvas",
      "Spaces",
      "Shopify App",
      "API",
    ],
  },
  {
    title: "Get started",
    links: [
      "How it works",
      "Pricing",
      "Documentation",
      "Help center",
      "Affiliate program",
      "Terms of use",
      "Privacy policy",
      "Trust center",
    ],
  },
  {
    title: "Company",
    links: [
      "About us",
      "Blog",
      "Careers",
      "Press",
      "Changelog",
      "Contact",
    ],
  },
  {
    title: "Get in touch",
    links: [
      "Customer support",
      "X / Twitter",
      "TikTok",
      "Instagram",
      "YouTube",
      "Discord",
      "LinkedIn",
    ],
  },
];

const BOTTOM_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Affiliate", href: "#" },
];

export function LpFooter() {
  return (
    <footer
      className="relative bg-[#0b0b0c] text-white overflow-hidden"
      style={{ fontFamily: "Manrope, sans-serif" }}
    >
      {/* Subtle top gradient bleed from the section above */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06]" />

      {/* Ambient purple glow — mirrors hero/closing CTA */}
      <div className="pointer-events-none absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-[#4f3bd6]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-[#8b7bff]/[0.05] blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_repeat(4,1fr)] gap-x-8 gap-y-12">

          {/* Logo + tagline — spans 2 cols on mobile */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-center gap-2.5 group">
              <img
                src={logoLight}
                alt="Korsola"
                className="w-8 h-8 object-contain"
              />
              <span className="text-[15px] font-display font-extrabold tracking-[0.14em] text-white">
                KORSOLA
              </span>
            </a>

            <p
              className="mt-5 text-white/45 text-[13.5px] leading-relaxed max-w-[220px]"
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
            >
              The AI ad studio for DTC brands on Meta and TikTok.
            </p>

            {/* Social pill row */}
            <div className="mt-7 flex flex-wrap gap-2">
              {["X", "TikTok", "IG", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="inline-flex items-center px-3 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/50 text-[11px] font-semibold tracking-wide hover:bg-white/10 hover:text-white/80 transition-colors duration-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#8b7bff] mb-5">
                {col.title}
              </div>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-white/50 hover:text-white/90 transition-colors duration-150 leading-none"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
          <span className="text-[12px] text-white/30">
            © 2026 Korsola. All rights reserved.
          </span>
          <div className="flex items-center gap-1">
            {BOTTOM_LINKS.map((l, i) => (
              <span key={l.label} className="flex items-center">
                {i > 0 && (
                  <span className="mx-2 text-white/20 text-[11px]">·</span>
                )}
                <a
                  href={l.href}
                  className="text-[12px] text-white/30 hover:text-white/70 transition-colors duration-150"
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Giant wordmark watermark */}
      <div className="overflow-hidden select-none pointer-events-none pb-4">
        <div
          className="text-center font-display font-extrabold tracking-tighter text-white/[0.07] leading-none"
          style={{ fontSize: "clamp(100px, 20vw, 300px)" }}
        >
          korsola
        </div>
      </div>
    </footer>
  );
}
