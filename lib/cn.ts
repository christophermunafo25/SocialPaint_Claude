import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function complianceBand(score: number): "ON-BRAND" | "MOSTLY" | "REVIEW" {
  if (score >= 90) return "ON-BRAND";
  if (score >= 75) return "MOSTLY";
  return "REVIEW";
}

export function complianceColor(score: number) {
  const band = complianceBand(score);
  // DS palette · success (mint-ish leaf), sand (warm), danger (coral-deep)
  if (band === "ON-BRAND") return { fg: "#a9e8b5", bg: "rgba(204, 253, 207, 0.10)" };
  if (band === "MOSTLY") return { fg: "#f3da8a", bg: "rgba(255, 244, 184, 0.10)" };
  return { fg: "#f29593", bg: "rgba(237, 116, 114, 0.10)" };
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${Math.max(seconds, 1)}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function shortId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}
