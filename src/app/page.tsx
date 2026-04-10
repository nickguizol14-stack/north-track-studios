import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Work } from "@/components/Work";
import { About } from "@/components/About";
import { Process } from "@/components/Process";
import { Survey } from "@/components/Survey";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { PageWithIntro } from "@/components/PageWithIntro";
import { ColorSchemeSwitcher } from "@/components/ColorSchemeSwitcher";
import { StyleSwitcher } from "@/components/StyleSwitcher";
import { ScrollTransition } from "@/components/ScrollTransitions";

export default function Home() {
  return (
    <PageWithIntro>
      <Navigation />
      <main className="flex-1">
        <Hero />
        <ScrollTransition variant="descent-grid" />
        <Services />
        <ScrollTransition variant="gold-convergence" />
        <Work />
        <ScrollTransition variant="ember-rise" />
        <About />
        <ScrollTransition variant="compass-pulse" />
        <Process />
        <ScrollTransition variant="brush-sweep" />
        <Survey embedded />
        <ScrollTransition variant="settling-dust" />
        <Contact />
      </main>
      <Footer />
      <StyleSwitcher />
      <ColorSchemeSwitcher />
    </PageWithIntro>
  );
}
