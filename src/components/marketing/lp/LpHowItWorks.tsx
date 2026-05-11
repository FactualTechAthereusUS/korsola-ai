const cards = [
  {
    caption: "Choose your model",
    body: "Pick the AI model that fits your creative goal. From realistic UGC videos to cinematic product visuals, every leading model, one platform.",
    video: "/videos/how/card_1.mp4",
  },
  {
    caption: "Cast the script & generate",
    body: "Choose your avatar, set your angle, and hit generate. Korsola writes the hook, builds the script, and delivers your full ad batch, ready to run.",
    image: "/videos/how/card_2.png",
    video: null,
  },
  {
    caption: "Get your winning ads",
    body: "Download, test, and scale. Every variation ready to run on Meta and TikTok. Same avatar, same brand, zero billing surprises.",
    video: "/videos/how/card_3.mp4",
  },
];

import { SplitWords } from "@/components/marketing/SplitWords";

export function LpHowItWorks() {
  return (
    <section id="how" className="bg-white py-20 md:py-28" style={{ fontFamily: "Manrope, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2
            className="font-extrabold text-[#0f0f10] tracking-tight text-4xl md:text-6xl leading-[1.05]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            <SplitWords>Create winning ads</SplitWords>{" "}
            <SplitWords
              className="italic font-normal"
              delay={0.21}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >with AI</SplitWords>
          </h2>
          <p className="mt-5 text-[#5b5b60] text-[17px] md:text-[19px] leading-relaxed max-w-2xl">
            One place to create anything. Every tool, every model, every format. Forget switching between dozens of platforms.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div key={c.caption}>
              <div className="aspect-[1820/2160] rounded-[28px] bg-[#0f0f10] overflow-hidden">
                {c.video ? (
                  <video
                    src={c.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                ) : c.image ? (
                  <img src={c.image} alt={c.caption} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="mt-6">
                <h3
                  className="italic text-[22px] md:text-[24px] text-[#0f0f10]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {c.caption}
                </h3>
                <p
                  className="mt-3 text-[#5b5b60] text-[15px] md:text-[16px] leading-relaxed max-w-sm"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
