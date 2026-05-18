"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { DEMO_GENERATION } from "@/lib/mock-data";
import { Detail } from "@/components/generate/Detail";

export default function DesignDetailPage() {
  const params = useParams<{ generationId: string; designId: string }>();
  const router = useRouter();
  const generations = useApp((s) => s.generations);
  const setGeneration = useApp((s) => s.setGeneration);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  let generation = generations[params.generationId];

  // Fallback · if landing on a history item that points back to the canonical
  // demo generation, materialize it so Detail can render.
  useEffect(() => {
    if (!hydrated) return;
    if (!generation && params.designId.startsWith("d_arch")) {
      setGeneration({ ...DEMO_GENERATION, id: params.generationId });
    }
  }, [generation, hydrated, params.designId, params.generationId, setGeneration]);

  if (!hydrated) return null;
  generation = generations[params.generationId] ?? DEMO_GENERATION;

  const design =
    generation.options.find((o) => o.id === params.designId) ??
    generation.options[0] ??
    DEMO_GENERATION.options[0];

  if (!design) {
    router.push("/generate");
    return null;
  }

  return <Detail generation={generation} design={design} />;
}
