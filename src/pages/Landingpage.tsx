import { useEffect } from "react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { LpHero } from "@/components/marketing/lp/LpHero";
import { LpReelCarousel } from "@/components/marketing/lp/LpReelCarousel";
import { LpHowItWorks } from "@/components/marketing/lp/LpHowItWorks";
import { LpModels } from "@/components/marketing/lp/LpModels";
import { LpEditScene } from "@/components/marketing/lp/edit-scene/LpEditScene";
import { LpFeaturesBento } from "@/components/marketing/lp/LpFeaturesBento";

import { LpActorsBlock } from "@/components/marketing/lp/LpActorsBlock";
import { LpEmotionLocalize } from "@/components/marketing/lp/LpEmotionLocalize";

import { LpTeamPlans } from "@/components/marketing/lp/LpTeamPlans";
import { LpEnterpriseFeatures } from "@/components/marketing/lp/LpEnterpriseFeatures";
import { LpFaq } from "@/components/marketing/lp/LpFaq";
import { LpClosingCTA } from "@/components/marketing/lp/LpClosingCTA";
import { LpFooter } from "@/components/marketing/lp/LpFooter";
import { Reveal } from "@/components/marketing/Reveal";

export default function Landingpage() {
  useEffect(() => {
    document.title = "Korsola — Create Winning Ads with AI";
  }, []);
  return (
    <div data-mk-page className="min-h-screen bg-bone text-ink">
      <MarketingHeader overlay />
      <main>
        <LpHero />
        <Reveal><LpReelCarousel /></Reveal>
        <Reveal><LpHowItWorks /></Reveal>
        <Reveal><LpModels /></Reveal>
        <LpEditScene />
        <Reveal><LpFeaturesBento /></Reveal>

        <section className="bg-ink text-white relative overflow-hidden">
          <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#4f3bd6]/20 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[#8b7bff]/15 blur-3xl" />
          <div className="pointer-events-none absolute top-2/3 -left-40 w-[600px] h-[600px] rounded-full bg-[#4f3bd6]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#8b7bff]/15 blur-3xl" />
          <div className="relative">
            <Reveal><LpActorsBlock /></Reveal>
            <Reveal><LpEmotionLocalize /></Reveal>
            <Reveal><LpTeamPlans /></Reveal>
            <Reveal><LpEnterpriseFeatures /></Reveal>
            <Reveal><LpFaq /></Reveal>
          </div>
        </section>
        <Reveal><LpClosingCTA /></Reveal>
      </main>
      <LpFooter />
    </div>
  );
}
