import { MoreVertical, Sparkles } from "lucide-react";
import avatar1 from "@/assets/team-avatar-1.png";
import avatar2 from "@/assets/team-avatar-2.png";
import avatar3 from "@/assets/team-avatar-3.png";
import avatar4 from "@/assets/team-avatar-4.png";

const tools = [
  { name: "Nano Banana Pro", type: "Image generation", on: true, color: "bg-[#8b7bff]/20 text-[#cfc4ff]" },
  { name: "Seedance 2", type: "Video generation", on: false, color: "bg-emerald-400/15 text-emerald-300" },
  { name: "ElevenLabs", type: "Audio/Speech", on: true, color: "bg-amber-400/15 text-amber-300" },
  { name: "Flux 2", type: "Image generation", on: false, color: "bg-[#8b7bff]/20 text-[#cfc4ff]" },
];

const users = [
  { name: "Zoya Kendall", email: "zoya.kendall@korsola.com", spent: "1.2M", avail: "1.7M", pct: 0.4, color: "bg-gradient-to-r from-[#8b7bff] to-[#4f3bd6]", img: avatar1 },
  { name: "Arlo Finch", email: "afinch@korsola.com", spent: "310.6K", avail: "877.1K", pct: 0.25, color: "bg-gradient-to-r from-[#8b7bff] to-[#4f3bd6]", img: avatar4 },
  { name: "Demi Ochoa", email: "demiochoa@korsola.com", spent: "10.7M", avail: "19.2M", pct: 0.55, color: "bg-gradient-to-r from-[#8b7bff] to-[#4f3bd6]", img: avatar2 },
  { name: "Nala Jones", email: "njones@korsola.com", spent: "69.9K", avail: "30K", pct: 0.7, color: "bg-amber-400", img: avatar3 },
];

export function LpTeamPlans() {
  return (
    <section className="text-white py-20 md:py-28 relative overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-display font-extrabold text-white text-4xl md:text-6xl tracking-tight leading-[1.02] max-w-2xl">
          Team plans built for <span className="font-serif italic font-normal">creative work</span> at scale
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-display font-extrabold text-white text-2xl">Business</h3>
            <p className="mt-3 text-white/60 text-[15px] leading-relaxed font-body">
              For creative teams and agencies ready to move faster and produce more.
              Shared credits, collaborative workflows, and access to every AI model —
              without the complexity of enterprise procurement.
            </p>
            <a
              href="#"
              className="group relative mt-5 inline-flex items-center justify-center gap-2 h-11 w-[180px] rounded-full text-[14px] font-semibold text-white whitespace-nowrap overflow-hidden border border-white/40 bg-gradient-to-b from-[#cfc4ff] via-[#8b7bff] to-[#4f3bd6] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(40,20,120,0.5),0_10px_30px_rgba(99,58,232,0.55)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_4px_rgba(40,20,120,0.6),0_14px_38px_rgba(99,58,232,0.7)] transition-all duration-300"
            >
              <span className="absolute top-0 left-3 right-3 h-1/2 rounded-t-full bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
              <span className="relative drop-shadow-[0_1px_1px_rgba(40,20,120,0.4)]">Learn more</span>
              <Sparkles className="relative w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
            </a>
          </div>
          <div>
            <h3 className="font-display font-extrabold text-white text-2xl">Enterprise</h3>
            <p className="mt-3 text-white/60 text-[15px] leading-relaxed font-body">
              For organizations where creative output is mission-critical. Full legal
              indemnification, enterprise-grade security, unlimited users, custom
              SSO, and a dedicated team from day one.
            </p>
            <button className="mt-5 h-11 px-6 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors">
              Talk to the team
            </button>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {/* Tools panel */}
          <div className="rounded-3xl bg-[#0e0e10] border border-white/10 p-7">
            <h4 className="font-display font-extrabold text-white text-xl">All the AI tools in <span className="font-serif italic font-normal">a single place</span></h4>
            <p className="mt-2 text-white/60 text-[14px] font-body">
              Access multiple top-performing generative models from a single platform.
              Choose models via the admin panel.
            </p>
            <div className="mt-6 rounded-xl bg-black/40 border border-white/5 p-4">
              <div className="grid grid-cols-[1fr_hidden_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-3 text-[11px] uppercase tracking-wider text-white/40 font-semibold pb-3 border-b border-white/5">
                <span>Name (12)</span><span className="hidden sm:inline">Type</span><span>Available</span><span>Actions</span>
              </div>
              {tools.map((t) => (
                <div key={t.name} className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-center py-3 border-b border-white/5 last:border-0 text-sm">
                  <span className="text-white truncate">{t.name}</span>
                  <span className={`hidden sm:inline px-2 py-0.5 rounded text-[11px] font-semibold ${t.color}`}>{t.type}</span>
                  <span className={`relative w-9 h-5 rounded-full shrink-0 ${t.on ? "bg-gradient-to-r from-[#8b7bff] to-[#4f3bd6]" : "bg-white/10"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${t.on ? "left-4" : "left-0.5"}`} />
                  </span>
                  <MoreVertical className="w-4 h-4 text-white/40 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>

          {/* Users panel */}
          <div className="rounded-3xl bg-[#0e0e10] border border-white/10 p-7">
            <h4 className="font-display font-extrabold text-white text-xl">Unlimited users, <span className="font-serif italic font-normal">flexible credits</span></h4>
            <p className="mt-2 text-white/60 text-[14px] font-body">
              Scale freely with no seat limits. Pay based on how many credits you
              use — not how many people use them.
            </p>
            <div className="mt-6 rounded-xl bg-black/40 border border-white/5 p-4 space-y-4">
              {users.map((u) => (
                <div key={u.email} className="flex items-center gap-3">
                  <img src={u.img} alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 text-[12px]">
                      <span className="text-white font-semibold truncate">{u.name}</span>
                      <span className="text-white/50 shrink-0 text-[11px]">{u.spent}</span>
                    </div>
                    <div className="text-[11px] text-white/40">{u.email}</div>
                    <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className={`h-full ${u.color}`} style={{ width: `${u.pct * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
