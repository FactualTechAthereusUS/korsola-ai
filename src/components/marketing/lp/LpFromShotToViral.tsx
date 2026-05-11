import { ArrowRight } from "lucide-react";

const cards = [
  { title: "Advertising", body: "Brief to final asset. No vendor chain, no waiting. Just the work.", grad: "linear-gradient(135deg,#7f1d1d,#ea580c)" },
  { title: "Product shots", body: "AI-powered photoshoots. No studio. No crew. No scheduling.", grad: "linear-gradient(135deg,#0f766e,#1e293b)" },
  { title: "Brand campaigns", body: "On-brand visuals, video, and audio at any scale, any format.", grad: "linear-gradient(135deg,#064e3b,#7c3aed)" },
];

export function LpFromShotToViral() {
  return (
    <section className="bg-paper py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="font-display font-extrabold text-oxblood tracking-tight text-4xl md:text-6xl leading-[1.02] max-w-3xl">
            From product shot to viral phenomenon
          </h2>
          <a href="/auth" className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-ink text-white text-[14px] font-semibold">
            Start creating <ArrowRight className="w-4 h-4" />
          </a>
        </div>
        <p className="mt-4 max-w-2xl text-oxblood/70 text-[15px] leading-relaxed">
          Global on-brand campaigns, product shots, and top-tier filmmaking.
          Everything a brand needs to show up at the highest level, in every format,
          every time.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="aspect-[3/2] sm:aspect-[4/5] rounded-3xl relative overflow-hidden" style={{ background: c.grad }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-white font-display font-extrabold text-2xl">{c.title}</h3>
                <p className="mt-2 text-white/80 text-[13px] leading-snug">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 aspect-[4/3] sm:aspect-[16/7] md:aspect-[16/6] rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg,#0c4a6e,#1e293b 70%,#475569)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(60% 100% at 50% 50%, rgba(255,255,255,0.15), transparent 70%)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <h3 className="text-white font-display font-extrabold text-3xl">Filmmaking</h3>
            <p className="mt-2 text-white/80 text-[14px] max-w-md">
              Characters, storyboards, and concepts to explore. Cinematic tools made
              for the final frame.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
