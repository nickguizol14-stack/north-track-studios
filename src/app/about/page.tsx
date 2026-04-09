import { Navigation } from "@/components/Navigation";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — North Track Studios",
  description: "North Track Studios operates at the boundary between artificial intelligence and human craft.",
};

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24">
        <About />
      </main>
      <Footer />
    </>
  );
}
