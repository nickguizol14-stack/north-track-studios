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

export default function Home() {
  return (
    <PageWithIntro>
      <Navigation />
      <main className="flex-1">
        <Hero />
        <Services />
        <Work />
        <About />
        <Process />
        <Survey embedded />
        <Contact />
      </main>
      <Footer />
    </PageWithIntro>
  );
}
