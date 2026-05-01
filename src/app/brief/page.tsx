import { Suspense } from "react";
import BriefSeed from "./BriefSeed";

export const metadata = {
  title: "NorthTrack Studios — Brief",
};

export default function BriefPage() {
  return (
    <Suspense fallback={null}>
      <BriefSeed />
    </Suspense>
  );
}
