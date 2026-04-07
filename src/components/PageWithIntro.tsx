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
      {/* Page renders at full opacity underneath — the intro overlay
          covers it and the wave reveal unmasks it progressively */}
      <div style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
