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
  // DS palette tuned for light surfaces — readable text inside tinted pills.
  if (band === "ON-BRAND") return { fg: "#3a6244", bg: "rgba(204, 253, 207, 0.55)" };
  if (band === "MOSTLY") return { fg: "#8a6a1f", bg: "rgba(255, 244, 184, 0.70)" };
  return { fg: "#a23a48", bg: "rgba(233, 69, 96, 0.10)" };
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
