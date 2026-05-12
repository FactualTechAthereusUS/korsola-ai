import { Sparkles } from "lucide-react";

export function LpActorsBlock() {
  return (
    <section className="text-white py-20 relative pt-[20px] md:py-[2px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">

        {/* ── Hero heading ── */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] items-start md:items-center gap-5 md:gap-8 px-2 md:px-4 py-8 md:py-14">
          <div>
            <h2 className="font-display font-extrabold text-white text-3xl md:text-5xl tracking-tight leading-[1.05]">
              The most realistic and{" "}
              <span className="font-serif italic font-normal">captivating AI videos</span>
            </h2>
            <p className="mt-4 text-white/60 text-[14px] md:text-[15px] max-w-xl leading-relaxed">
              Motion control, video generation, image studio, emotional control, AI editing.
              Every creative tool your brand needs, in one place. Use 1,000+ ready-made
              avatars or upload one photo and build your own.
            </p>
          </div>
          <div className="md:shrink-0">
            <a
              href="/auth"
              className="group relative inline-flex items-center justify-center gap-2 h-12 w-[200px] sm:w-[220px] rounded-full text-[14px] sm:text-[15px] font-semibold text-white whitespace-nowrap overflow-hidden border border-white/40 bg-gradient-to-b from-[#cfc4ff] via-[#8b7bff] to-[#4f3bd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(40,20,120,0.5),0_10px_30px_rgba(99,58,232,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(40,20,120,0.6),0_14px_38px_rgba(99,58,232,0.7)] transition-all duration-300"
            >
              <span className="absolute top-0 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              <span className="relative drop-shadow-[0_1px_1px_rgba(40,20,120,0.4)]">Create Your AI Ad</span>
              <Sparkles className="relative w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            </a>
          </div>
        </div>

        {/* ── 2 sub-cards ── */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Card 1 — AI Actor row */}
          <div className="rounded-3xl bg-[#0e0e10] border border-white/10 p-5 sm:p-7 w-full mx-auto flex flex-col max-w-[398px] h-[478px] md:h-auto md:max-w-[486px]">
            {/* Video row — middle hero, sides peek and dim */}
            <div className="relative -mx-5 sm:-mx-7 -mt-5 sm:-mt-7 pt-6 sm:pt-10 pb-3 sm:pb-4 overflow-hidden rounded-t-3xl">
              {/* Top fade band */}
              <div className="absolute inset-x-0 top-0 h-8 sm:h-10 bg-[#0e0e10] z-20 pointer-events-none" />
              <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
                {([
                  "/videos/actors/actor_1.mp4",
                  "/videos/actors/actor_2.mp4",
                  "/videos/actors/actor_3.mp4",
                ] as const).map((src, i) => {
                  const isMain = i === 1;
                  return (
                    <div
                      key={i}
                      className="relative shrink-0 rounded-2xl overflow-hidden bg-black"
                      style={{
                        // Responsive widths via CSS clamp — scales with viewport
                        width: isMain
                          ? "clamp(140px, 42vw, 230px)"
                          : "clamp(110px, 34vw, 215px)",
                        aspectRatio: "9 / 16",
                        // Negative margins let sides bleed beyond the overflow boundary
                        marginLeft:  i === 0 ? "clamp(-40px, -6.5vw, -22px)" : 0,
                        marginRight: i === 2 ? "clamp(-40px, -6.5vw, -22px)" : 0,
                      }}
                    >
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="w-full h-full object-cover"
                      />
                      {!isMain && (
                        <div className="absolute inset-0 bg-black/45 pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-3 text-white/85 text-[13px] text-center">Actors holding your product</p>
            <div className="mt-3 flex justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/85" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
            </div>
            <h3 className="mt-5 font-display font-extrabold text-white text-xl sm:text-2xl">
              Create your own <span className="font-serif italic font-normal">AI Actor</span>
            </h3>
            <p className="mt-2 text-white/60 text-[14px] leading-relaxed">
              Generate a face — and make them hold your product, show your app, and
              wear your clothes.
            </p>
          </div>

          {/* Card 2 — AI Video Editing */}
          <div className="rounded-3xl bg-[#0e0e10] border border-white/10 p-5 sm:p-7 w-full mx-auto flex flex-col max-w-[398px] h-[478px] md:h-auto md:min-h-[623px] md:max-w-[486px]">
            <div className="flex justify-center items-end gap-3 sm:gap-4 pt-4 sm:pt-6 pb-6 sm:pb-8">

              {/* Video 1 — EXISTING VIDEO — sits slightly lower */}
              <div className="relative flex-1 max-w-[46%] mt-6 sm:mt-8">
                <div className="relative rounded-2xl overflow-hidden bg-black w-full aspect-[9/16]">
                  <video
                    src="/videos/actors/edit_1.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 font-serif italic text-white text-[11px] sm:text-[13px] whitespace-nowrap">
                  EXISTING VIDEO
                </span>
              </div>

              {/* Video 2 — WITH YOUR PRODUCT — sits higher */}
              <div className="relative flex-1 max-w-[46%]">
                <div className="relative rounded-2xl overflow-hidden bg-black w-full aspect-[9/16]">
                  <video
                    src="/videos/actors/edit_2.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute left-1/2 -bottom-6 -translate-x-1/2 font-serif italic text-white text-[11px] sm:text-[13px] whitespace-nowrap">
                  WITH YOUR PRODUCT
                </span>
              </div>

            </div>

            <div className="mt-auto pt-3 sm:pt-6">
              <h3 className="font-display font-extrabold text-white text-xl sm:text-2xl">
                AI Video <span className="font-serif italic font-normal">Editing</span>
              </h3>
              <p className="mt-2 text-white/60 text-[14px] leading-relaxed">
                Edit any AI video — drop in your product, swap faces, tweak motion,
                and add B-rolls or music in one click.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
