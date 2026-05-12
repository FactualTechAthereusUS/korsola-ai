import { useEffect, useState } from "react";
import heroBg from "@/assets/lp-hero-bg.webp";
import { LpGradientCTA } from "./LpGradientCTA";
import { SplitWords } from "@/components/marketing/SplitWords";

const HERO_LOGOS = [
  { type: "image" as const, src: "/logos/comfrt.png", alt: "Comfrt" },
  { type: "image" as const, src: "/logos/oodie.png", alt: "The Oodie" },
  { type: "image" as const, src: "/logos/unhinged-one.png", alt: "Unhinged One" },
  { type: "svg" as const, key: "bloom", alt: "Bloom Nutrition" },
];

const PHRASES = [
  "Cast AI avatars",
  "Generate UGC ads",
  "Shoot product videos",
  "Try-on with avatars",
  "Unbox like a creator",
  "Tutorials in one click",
  "Spaces workflows",
  "Stay on brand",
  "Localize in 30 languages",
  "Batch 100 variations",
  "Winning ads library",
  "Static ads in seconds",
];

export function LpHero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
        fetchPriority="high"
        decoding="sync"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

      <div className="relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 pt-28 md:pt-36 pb-20 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center min-h-[460px] md:min-h-[540px]">
          {/* LEFT */}
          <div className="mk-fade-up text-left md:ml-[260px]">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-[15px] md:text-[17px] text-white shadow-sm">
              <span className="font-serif italic">Seedance 2.0</span> is live
            </span>

            <h1 className="mt-6 font-display font-extrabold text-white tracking-tight text-[40px] sm:text-[52px] md:text-[64px] leading-[1.04] drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
              <SplitWords>Create winning ads</SplitWords>{" "}
              <SplitWords className="font-serif italic font-normal" delay={0.21}>with AI</SplitWords>
            </h1>

            <p className="mt-5 text-[15px] md:text-[17px] text-white/85 max-w-md">
              Use our library of 1,000+ captivating AI Actors, or create your own AI
              Avatar — built for Shopify brands shipping ads at scale.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <LpGradientCTA href="/auth">Create Your AI Ad</LpGradientCTA>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 h-12 w-[220px] rounded-full text-[15px] font-semibold bg-white text-[#0f0f10] border border-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Continue with Google
                <GoogleG />
              </a>
            </div>
          </div>

          {/* RIGHT — stepped vertical carousel (desktop only) */}
          <div className="hidden md:block">
            <SteppedPhrases />
          </div>
        </div>

        {/* LOGOS BELOW */}
        <div className="relative mt-14 md:mt-20 text-center" style={{ fontFamily: "Manrope, sans-serif" }}>
          <p className="text-[13px] md:text-[14px] text-white/85">
            Trusted by 18,000+ brands and agencies — DTC, performance teams, studios
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:flex-nowrap md:gap-14 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {HERO_LOGOS.map((l, i) =>
              l.type === "image" ? (
                <img
                  key={i}
                  src={l.src}
                  alt={l.alt}
                  className="h-6 md:h-8 w-auto object-contain opacity-80 brightness-0 invert shrink-0"
                />
              ) : (
                <svg
                  key={i}
                  viewBox="0 0 132 48"
                  className="h-6 md:h-8 w-auto text-white/80 shrink-0"
                  fill="currentColor"
                  aria-label={l.alt}
                  role="img"
                >
                  <path d="M15.5694 12.8164C16.781 12.588 19.4727 11.788 19.1477 7.24805C19.1477 7.24805 14.2194 7.79138 14.8344 12.268C14.8344 12.268 14.881 12.628 15.0544 12.768C15.1324 12.8106 15.2184 12.8369 15.3069 12.8452C15.3954 12.8535 15.4847 12.8437 15.5694 12.8164Z" />
                  <path d="M14.1043 12.1433C14.0343 10.2533 13.4343 5.99999 6.48427 5.45499C6.48427 5.45499 6.18761 13.0433 13.1059 13.13C13.1059 13.13 13.6626 13.1417 13.9143 12.9117C14.0676 12.77 14.1176 12.49 14.1043 12.1433Z" />
                  <path d="M10.9858 38.855C10.9858 38.855 10.9741 39.11 11.3691 39.01C11.7641 38.91 12.1274 38.815 12.5124 38.7383C14.5424 38.3383 16.1491 38.5717 18.1508 38.9283C22.2208 39.6583 26.7391 40.31 30.3558 37.8033C32.3691 36.41 33.7441 34.1533 33.8758 31.6883C33.9366 30.5645 33.7234 29.4428 33.2545 28.4196C32.7856 27.3965 32.0751 26.5026 31.1841 25.815C30.1352 25.0158 28.8734 24.5444 27.5574 24.46C28.5658 23.8813 29.4036 23.0468 29.9863 22.0407C30.5689 21.0346 30.8757 19.8926 30.8758 18.73C30.8659 17.7348 30.6338 16.7544 30.1964 15.8605C29.7589 14.9666 29.1272 14.1817 28.3474 13.5633C26.7058 12.2633 24.6174 11.8433 22.5658 11.975C20.7324 12.0933 18.9458 12.6733 17.1608 13.205C15.4358 13.7117 14.0508 14.0733 12.3008 13.8867C11.9674 13.8517 11.6341 13.795 11.3158 13.74C10.9974 13.685 10.9824 13.9183 10.9824 13.9183L10.9858 38.855ZM19.0591 35.6983C18.3774 34.9983 18.0958 33.9433 18.0958 32.7183V26.605C18.0958 26.13 18.2491 26.055 18.9874 25.9933C18.9874 25.9933 21.9008 25.7 23.5758 26.9817C25.3591 28.345 25.9991 30.8867 25.5158 33.06C25.1241 34.82 23.8391 36.3933 21.9624 36.6167C20.9491 36.735 19.7958 36.4567 19.0591 35.6983ZM21.2391 15.365C22.7658 15.5433 23.8108 16.8267 24.1291 18.2583C24.5224 20.025 24.0024 22.0917 22.5524 23.2C21.1908 24.2433 18.8208 24.0033 18.8208 24.0033C18.2208 23.9533 18.0941 23.8917 18.0958 23.5033V18.5317C18.0958 17.5317 18.3258 16.6783 18.8791 16.1083C19.4774 15.5 20.4158 15.2667 21.2391 15.3617V15.365Z" />
                  <path d="M43.9885 38.3336C43.9885 38.6453 43.7451 38.8186 43.2951 38.7836C42.6035 38.7153 40.9835 38.6453 38.9068 38.6453C36.8301 38.6453 35.5118 38.7153 34.7851 38.7836C34.3335 38.8186 34.0918 38.6453 34.0918 38.3336C34.0918 38.022 34.3335 37.8836 34.7501 37.7453C35.4768 37.537 35.5835 36.8103 35.5835 35.5286V17.6953C35.5835 16.4136 35.4785 15.6853 34.7501 15.4436C34.3335 15.3403 34.0918 15.167 34.0918 14.8553C34.0918 14.5086 34.3001 14.3353 34.7151 14.232C35.9268 14.0236 39.1401 13.3986 41.7368 12.1186C42.1868 11.8753 42.4985 12.0836 42.4985 12.5686V35.5336C42.4985 36.8153 42.6035 37.542 43.3651 37.7503C43.7801 37.8886 43.9885 38.027 43.9885 38.3336Z" />
                  <path d="M64.7221 28.9183C64.7221 34.6333 60.7738 39.24 54.4704 39.24C48.1371 39.24 44.2188 34.6333 44.2188 28.9183C44.2521 23.2367 48.1321 18.5967 54.4704 18.5967C60.7738 18.5967 64.7221 23.2367 64.7221 28.9183ZM51.5004 29.5183C52.2821 33.6583 53.9021 37.1083 56.1521 36.685C58.3188 36.175 58.2521 32.395 57.5021 28.315C56.6921 24.205 55.0721 20.725 52.8521 21.1483C50.6671 21.6667 50.7238 25.4383 51.5004 29.5183Z" />
                  <path d="M86.2609 28.9183C86.2609 34.6333 82.3109 39.24 76.0075 39.24C69.6742 39.24 65.7559 34.6333 65.7559 28.9183C65.7909 23.2367 69.6692 18.5967 76.0075 18.5967C82.3109 18.5967 86.2609 23.2367 86.2609 28.9183ZM73.0409 29.5183C73.8209 33.6583 75.4409 37.1083 77.6909 36.685C79.8575 36.175 79.7909 32.395 79.0409 28.315C78.2309 24.205 76.6109 20.725 74.3909 21.1483C72.2009 21.6667 72.2609 25.4383 73.0409 29.5183Z" />
                  <path d="M87.9688 35.5333C87.9688 36.815 87.8655 37.5417 87.1038 37.75C86.7221 37.8883 86.4805 38.0267 86.4805 38.3383C86.4805 38.65 86.7221 38.8233 87.1738 38.7883C87.9005 38.72 89.2171 38.65 91.2938 38.65C93.3705 38.65 94.9921 38.72 95.6838 38.7883C96.1338 38.8233 96.3771 38.65 96.3771 38.3383C96.3771 38.0267 96.1688 37.8883 95.7538 37.75C94.9921 37.5417 94.8871 36.815 94.8871 35.5333V27.2367C94.8871 24.8133 95.7888 22.3533 98.2471 22.3533C100.672 22.3533 101.26 24.7083 101.26 27.41V35.5333C101.26 36.815 101.19 37.5417 100.427 37.75C100.012 37.8883 99.7605 38.0267 99.7605 38.3383C99.7605 38.65 100.039 38.8233 100.489 38.7883C101.18 38.72 102.489 38.65 104.575 38.65C106.662 38.65 108.272 38.72 108.965 38.7883C109.415 38.8233 109.692 38.65 109.692 38.3383C109.692 38.0267 109.45 37.8883 109.025 37.75C108.264 37.5417 108.192 36.815 108.192 35.5333V27.2367C108.192 24.8133 109.092 22.3533 111.525 22.3533C113.959 22.3533 114.572 24.7083 114.572 27.41V35.5333C114.572 36.815 114.469 37.5417 113.707 37.75C113.29 37.8883 113.084 38.0267 113.084 38.3383C113.084 38.65 113.325 38.8233 113.775 38.7883C114.469 38.72 116.087 38.65 118.165 38.65C120.244 38.65 121.56 38.72 122.287 38.7883C122.737 38.8233 122.98 38.65 122.98 38.3383C122.98 38.0267 122.737 37.8883 122.314 37.75C121.585 37.5417 121.48 36.815 121.48 35.5333V26.805C121.48 21.4017 119.065 18.5967 114.147 18.5967C110.372 18.5967 108.502 20.64 107.565 22.545C106.597 19.9467 104.25 18.5967 100.822 18.5967C97.5855 18.5967 95.8221 20.2367 94.8738 22.0167C94.8738 21.655 94.8855 21.1283 94.8638 20.755C94.8635 20.408 94.7646 20.0681 94.5788 19.775C94.0205 19.02 92.4388 19.1733 91.0471 19.1617L87.1671 19.1667C86.7155 19.1767 86.6271 19.425 86.6271 19.6317C86.6271 19.9433 86.9205 20.065 87.1271 20.2067C87.8671 20.6533 87.9605 21.1417 87.9605 22.4233L87.9688 35.5333Z" />
                </svg>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function PinkPlay() {
  return (
    <svg width="22" height="26" viewBox="0 0 22 26" className="drop-shadow-[0_2px_8px_rgba(236,72,153,0.6)]">
      <path d="M2 2 L20 13 L2 24 Z" fill="#ec4899" />
    </svg>
  );
}

function SteppedPhrases() {
  const ITEM_H = 56; // tighter row height
  // Triple the list so we can translate continuously without snap
  const loop = [...PHRASES, ...PHRASES, ...PHRASES];
  const [idx, setIdx] = useState(PHRASES.length); // start in the middle copy

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), 1400);
    return () => clearInterval(t);
  }, []);

  // When we drift past the third copy, silently jump back by one list length
  useEffect(() => {
    if (idx >= PHRASES.length * 2) {
      const id = setTimeout(() => setIdx((i) => i - PHRASES.length), 700);
      return () => clearTimeout(id);
    }
  }, [idx]);

  const noTransition = idx < PHRASES.length;
  const activeMod = ((idx % PHRASES.length) + PHRASES.length) % PHRASES.length;

  return (
    <div
      className="relative h-[320px] md:h-[420px] overflow-hidden mk-fade-up md:pl-[760px] lg:pl-[1040px] xl:pl-[1240px] text-right md:ml-[119px]"
      style={{
        animationDelay: "0.1s",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
      }}
    >
      {/* Fixed pink pointer at vertical center */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <PinkPlay />
      </div>

      <ul
        className="absolute left-10 md:left-14 right-0 top-1/2 m-0 p-0 list-none will-change-transform"
        style={{
          transform: `translateY(calc(-${ITEM_H / 2}px - ${idx * ITEM_H}px))`,
          transition: noTransition
            ? "none"
            : "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {loop.map((phrase, i) => {
          const phraseIdx = i % PHRASES.length;
          const isActive = phraseIdx === activeMod;
          return (
            <li
              key={i}
              className={`flex items-center font-display font-extrabold tracking-tight whitespace-nowrap text-[20px] md:text-[26px] leading-[1.1] transition-opacity duration-400 ${
                isActive ? "text-white opacity-100" : "text-white/30"
              }`}
              style={{ height: `${ITEM_H}px` }}
            >
              {phrase}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

