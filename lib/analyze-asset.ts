// Simulated asset analysis — returns 5–7 detected observations after ~3s.
import type { AssetIngestion, DetectedObservation } from "./types";
import { shortId } from "./cn";

const POOL: Omit<DetectedObservation, "id" | "accepted">[] = [
  {
    category: "Colors",
    title: "Coral used as accent only",
    description: "Coral never appears as a flat background; always as a 600px radial halo or text accent.",
    confidence: "Strong",
  },
  {
    category: "Colors",
    title: "Obsidian primary surface",
    description: "Primary backgrounds sit at #0A0A0A. Cards step up to #171717.",
    confidence: "Strong",
  },
  {
    category: "Typography",
    title: "Headlines never bold",
    description: "All headlines use weight 400. Weight 500+ is reserved for badges and labels.",
    confidence: "Strong",
  },
  {
    category: "Typography",
    title: "Tracking −1.5px on display sizes",
    description: "Sizes above 40px use −1.5px tracking. Body type is neutral.",
    confidence: "Moderate",
  },
  {
    category: "Layout",
    title: "8px vertical rhythm",
    description: "Spacing snaps to an 8px grid; deviations are rare and intentional.",
    confidence: "Strong",
  },
  {
    category: "Layout",
    title: "Hero copy anchored bottom-left",
    description: "Display copy hangs at the bottom-left in nearly every hero composition.",
    confidence: "Moderate",
  },
  {
    category: "Voice",
    title: "Periods, never exclamations",
    description: "Headlines end in periods. Exclamation marks do not appear.",
    confidence: "Strong",
  },
];

export function simulateAssetAnalysis(input: {
  source: "upload" | "link";
  fileName?: string;
  url?: string;
  createdBy: string;
}): Promise<AssetIngestion> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const count = 5 + Math.floor(Math.random() * 3); // 5–7
      const shuffled = [...POOL].sort(() => Math.random() - 0.5).slice(0, count);
      const detectedObservations: DetectedObservation[] = shuffled.map((o) => ({
        ...o,
        id: shortId("obs"),
        accepted: null,
      }));
      const thumbnailUrl =
        input.source === "link"
          ? "radial-gradient(circle at 70% 55%, rgba(237,116,114,0.45), rgba(237,116,114,0) 55%), #0A0A0A"
          : "radial-gradient(circle at 30% 50%, rgba(124,227,181,0.30), rgba(124,227,181,0) 60%), #0A0A0A";
      resolve({
        id: shortId("ing"),
        source: input.source,
        fileName: input.fileName,
        url: input.url,
        thumbnailUrl,
        status: "review",
        detectedObservations,
        createdBy: input.createdBy,
        createdAt: new Date().toISOString(),
      });
    }, 3000);
  });
}
