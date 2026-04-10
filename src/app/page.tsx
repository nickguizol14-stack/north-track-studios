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
        <ScrollTransition variant="the-forge" />
        <Services />
        <ScrollTransition variant="neural-web" />
        <Work />
        <ScrollTransition variant="gold-pour" />
        <About />
        <ScrollTransition variant="star-chart" />
        <Process />
        <ScrollTransition variant="kintsugi" />
        <Survey embedded />
        <ScrollTransition variant="aurora" />
        <Contact />
      </main>
      <Footer />
      <StyleSwitcher />
      <ColorSchemeSwitcher />
    </PageWithIntro>
  );
}
