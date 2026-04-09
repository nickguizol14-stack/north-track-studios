import { Navigation } from "@/components/Navigation";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capabilities — North Track Studios",
  description: "Six core disciplines, unified by a single principle: build intelligent systems that perform in production.",
};

export default function CapabilitiesPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24">
        <Services />
      </main>
      <Footer />
    </>
  );
}
