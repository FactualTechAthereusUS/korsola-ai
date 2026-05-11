const results = [
  { stat: "2.7×", label: "Higher ROAS", quote: "Korsola let us 10× our creative output without growing the team.", who: "Maya R., Performance Lead at Bloom" },
  { stat: "73%", label: "Lower CPA", quote: "We replaced our entire UGC creator roster in week one.", who: "Tom F., Founder at NorthSide" },
  { stat: "10×", label: "Creative output", quote: "Best-in-class output, transparent pricing — no surprise invoices.", who: "Priya L., Head of Growth at Lumen" },
];

export function LpResults() {
  return (
    <section className="bg-bone py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-extrabold text-ink text-4xl md:text-5xl tracking-tight leading-[1.05]">
            Real results from{" "}
            <span className="font-serif italic font-normal">real DTC brands</span>.
          </h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {results.map((r) => (
            <div key={r.label} className="rounded-3xl bg-white border border-line p-7 mk-card">
              <div className="font-display font-extrabold text-ink text-6xl tracking-tight">{r.stat}</div>
              <div className="mt-1 text-ink-soft text-sm uppercase tracking-wider font-semibold">{r.label}</div>
              <p className="mt-6 text-ink text-[15px] leading-relaxed">"{r.quote}"</p>
              <p className="mt-3 text-ink-soft text-[13px]">{r.who}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
