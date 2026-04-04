"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { IntroSequence } from "./IntroSequence";

export function PageWithIntro({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);

  const handleComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  // Once intro is complete, trigger the page fade-in after a brief moment
  useEffect(() => {
    if (introComplete) {
      const timer = setTimeout(() => setPageVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [introComplete]);

  return (
    <>
      {!introComplete && <IntroSequence onComplete={handleComplete} />}
      <div
        style={{
          opacity: pageVisible ? 1 : 0,
          transform: pageVisible ? "none" : "translateY(8px)",
          transition: "opacity 1s ease-out, transform 1s ease-out",
        }}
      >
        {children}
      </div>
    </>
  );
}
