import { Shield, Lock, Settings, FileCheck, Headphones, Users } from "lucide-react";

const features = [
  { icon: FileCheck, title: "Legal indemnification", body: "Full legal protection on AI-generated content used commercially." },
  { icon: Lock, title: "Security & compliance", body: "GDPR, ISO/IEC 27001, and SOC 2. Procurement-ready from day one." },
  { icon: Settings, title: "Admin control", body: "Users, permissions, credits, and model access — one dashboard, total visibility." },
  { icon: Shield, title: "You own everything", body: "Every asset belongs to you. We never train on your data." },
  { icon: Headphones, title: "Dedicated support", body: "A real team, from onboarding through to day-to-day." },
  { icon: Users, title: "Scale without limits", body: "Flexible credits, parallel generations, and no seat restrictions." },
];

const quotes = [
  { brand: "R/GA", who: "Nick Coronges", role: "CTO at R/GA", quote: "Best-in-class models and workflow tools through a single unified interface. Korsola has been a key unlock as we've woven AI into our workflows, end to end." },
  { brand: "Delivery Hero", who: "Javier Romero", role: "Global Head of Content, Marketing at Delivery Hero", quote: "Korsola consistently delivers high-quality, reliable results while streamlining workflows and enhancing efficiency." },
  { brand: "job&talent", who: "Juan Urdiales", role: "Co-Founder and Co-CEO, Job&Talent", quote: "Korsola is a key part of our marketing stack. It helps us create high-quality content at scale as we expand our AI-native workforce platform." },
];

export function LpEnterpriseFeatures() {
  return (
    <section className="text-white pb-24 md:pb-32 relative overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#0e0e10] border border-white/10 p-8 md:p-12">
          <h3 className="font-display font-extrabold text-white text-3xl md:text-4xl tracking-tight">
            Enterprise features <span className="font-serif italic font-normal">built for scale</span>
          </h3>
          <p className="mt-3 text-white/60 text-[15px] max-w-xl font-body">
            Security, compliance, and admin control for teams of any size.
          </p>
          <div className="mt-10 grid md:grid-cols-3 gap-x-10 gap-y-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b7bff]/25 to-[#4f3bd6]/15 border border-[#8b7bff]/30 shrink-0">
                  <f.icon className="w-4 h-4 text-[#cfc4ff]" />
                </span>
                <div>
                  <h4 className="font-display font-bold text-white text-[15px]">{f.title}</h4>
                  <p className="mt-1 text-white/55 text-[13px] leading-relaxed font-body">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-10">
          {quotes.map((q) => (
            <div key={q.brand}>
              <div className="font-display font-extrabold text-white/90 tracking-tight text-lg">{q.brand}</div>
              <p className="mt-4 text-white/80 text-[15px] leading-relaxed font-body">"{q.quote}"</p>
              <div className="mt-4 text-white text-[13px] font-semibold">{q.who}</div>
              <div className="text-white/50 text-[12px]">{q.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
