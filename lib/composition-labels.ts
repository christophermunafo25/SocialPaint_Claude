// Short, user-readable labels for each composition key.
import type { CompositionKey } from "./compositions";

export function compositionLabel(key: CompositionKey): string {
  switch (key) {
    case "announcement":
      return "Announcement";
    case "pull-quote":
      return "Pull quote";
    case "stat-callout":
      return "Stat callout";
    case "editorial-cover":
      return "Editorial cover";
    case "paper-card":
      return "Case study card";
    case "warm-mesh":
      return "Warm mesh";
    case "event-promo":
      return "Event card";
    case "minimal-quote":
      return "Minimal";
    case "banner-strip":
      return "Banner strip";
    case "carousel-slide":
      return "Carousel slide";
  }
}
