"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, useCurrentUser } from "@/lib/store";
import { simulateGeneration } from "@/lib/generate";
import { DEMO_GENERATION, DEMO_PROMPT } from "@/lib/mock-data";
import { Generating } from "@/components/generate/Generating";
import { Results } from "@/components/generate/Results";

export default function GenerationPage() {
  const params = useParams<{ generationId: string }>();
  const router = useRouter();
  const generations = useApp((s) => s.generations);
  const setGeneration = useApp((s) => s.setGeneration);
  const pushActivity = useApp((s) => s.pushActivity);
  const user = useCurrentUser();
  const generation = generations[params.generationId];
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // If user lands directly on a generation id that doesn't exist, treat it as
  // a fresh demo generation kickoff.
  useEffect(() => {
    if (!hydrated) return;
    if (generation) return;
    setGeneration({
      id: params.generationId,
      prompt: DEMO_PROMPT,
      designType: DEMO_GENERATION.designType,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      status: "generating",
      options: [],
    });
    simulateGeneration(DEMO_PROMPT, DEMO_GENERATION.designType, user.id).then((real) => {
      setGeneration({ ...real, id: params.generationId });
      pushActivity({
        type: "generation",
        actorId: user.id,
        prompt: DEMO_PROMPT,
        designType: DEMO_GENERATION.designType,
        generationId: params.generationId,
        designId: real.options[0]?.id,
        complianceScore: real.options[0]?.complianceScore,
      });
    });
  }, [generation, hydrated, params.generationId, pushActivity, setGeneration, user.id]);

  if (!hydrated || !generation) {
    return <Generating />;
  }

  if (generation.status === "generating" || generation.options.length === 0) {
    return <Generating />;
  }

  return <Results generation={generation} />;
}
