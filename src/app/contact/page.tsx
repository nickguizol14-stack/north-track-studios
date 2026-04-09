import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — North Track Studios",
  description: "Start a project with North Track Studios. We take on a carefully selected number of engagements each quarter.",
};

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
