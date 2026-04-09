import { Navigation } from "@/components/Navigation";
import { Process } from "@/components/Process";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Process — North Track Studios",
  description: "Our proven process: Discovery, Architecture, Engineering, Launch, and Evolution.",
};

export default function ProcessPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24">
        <Process />
      </main>
      <Footer />
    </>
  );
}
