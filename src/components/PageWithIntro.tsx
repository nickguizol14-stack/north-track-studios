"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { IntroSequence } from "./IntroSequence";

export function PageWithIntro({ children }: { children: ReactNode }) {
  const [introComplete, setIntroComplete] = useState(true); // default true to avoid flash
  const [shouldShowIntro, setShouldShowIntro] = useState(false);

  useEffect(() => {
    // Scroll to top on page load so the intro/hero is always visible
    window.scrollTo(0, 0);

    // Only show intro once per session
    const hasSeenIntro = sessionStorage.getItem("intro-seen");
    if (!hasSeenIntro) {
      setShouldShowIntro(true);
      setIntroComplete(false);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setIntroComplete(true);
    sessionStorage.setItem("intro-seen", "1");
  }, []);

  return (
    <>
      {shouldShowIntro && !introComplete && (
        <IntroSequence onComplete={handleComplete} />
      )}
      <div style={{ opacity: 1 }}>
        {children}
      </div>
    </>
  );
}
