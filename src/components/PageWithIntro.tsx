"use client";

import { useState, useCallback, type ReactNode } from "react";
import { IntroSequence } from "./IntroSequence";

export function PageWithIntro({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);

  const handleComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <>
      {!introComplete && <IntroSequence onComplete={handleComplete} />}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          transition: "opacity 0.4s ease-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
