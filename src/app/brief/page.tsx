import { Navigation } from "@/components/Navigation";
import { Survey } from "@/components/Survey";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick Brief — North Track Studios",
  description:
    "Tell us about your project in 3 quick questions. We'll get back to you within 24 hours.",
};

export default function BriefPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-20">
        <Survey />
      </main>
      <Footer />
    </>
  );
}
