"use client";
import { useSearchParams } from "next/navigation";
import { BriefQuestionnaire } from "@/components/brief/BriefQuestionnaire";

export default function BriefSeed() {
  const params = useSearchParams();
  const seed = params.get("seed") ?? undefined;
  return <BriefQuestionnaire seed={seed} />;
}
