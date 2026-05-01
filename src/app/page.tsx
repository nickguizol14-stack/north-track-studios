"use client";
import { useState } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { IntroStage } from "@/components/intro/IntroStage";
import { PracticeChapter } from "@/components/chapters/PracticeChapter";
import { CapabilitiesChapter } from "@/components/chapters/capabilities/CapabilitiesChapter";
import { WorkChapter } from "@/components/chapters/work/WorkChapter";
import { ProcessChapter } from "@/components/chapters/process/ProcessChapter";
import { BriefTeaser } from "@/components/chapters/BriefTeaser";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";
import { ChapterBreak } from "@/components/primitives";

export default function Home() {
  const [handedOff, setHandedOff] = useState(false);

  return (
    <>
      <ScrollProgress />
      <NavShell show={handedOff} />

      <IntroStage onHandoffChange={setHandedOff} />

      <PracticeChapter />
      <ChapterBreak n="01" />

      <CapabilitiesChapter />
      <ChapterBreak n="02" />

      <WorkChapter />
      <ChapterBreak n="03" />

      <ProcessChapter />
      <ChapterBreak n="04" />

      <BriefTeaser />
      <ChapterBreak n="05" />

      <ContactClosing />
      <FooterMini />
    </>
  );
}
