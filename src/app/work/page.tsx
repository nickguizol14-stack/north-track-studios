import { Navigation } from "@/components/Navigation";
import { Work } from "@/components/Work";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — North Track Studios",
  description: "A selection of systems we've engineered. Each one started as an impossible brief and shipped as production infrastructure.",
};

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24">
        <Work />
      </main>
      <Footer />
    </>
  );
}
