import type { CSSProperties } from "react";

export const productBackgroundSettingKeys = [
  "products.backgroundMode",
  "products.backgroundColor",
  "products.gradientFrom",
  "products.gradientTo",
  "products.backgroundImage"
] as const;

export type ProductBackgroundMode = "default" | "color" | "gradient" | "image";

const hexColorPattern = /^#[0-9a-f]{6}$/i;

function safeColor(value: string | undefined, fallback: string) {
  const normalized = value?.trim();
  return normalized && hexColorPattern.test(normalized) ? normalized : fallback;
}

function safeBackgroundUrl(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized || /["'()\\\r\n]/.test(normalized)) return "";
  if (normalized.startsWith("/")) return normalized;

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

export function getProductBackgroundMode(value: string | undefined): ProductBackgroundMode {
  return value === "color" || value === "gradient" || value === "image" ? value : "default";
}

export function getProductBackgroundPresentation(settings: Record<string, string>): {
  mode: ProductBackgroundMode;
  style?: CSSProperties;
  overlayClassName?: string;
} {
  const mode = getProductBackgroundMode(settings["products.backgroundMode"]);

  if (mode === "color") {
    return {
      mode,
      style: { backgroundColor: safeColor(settings["products.backgroundColor"], "#f8fcff") },
      overlayClassName: "bg-white/35"
    };
  }

  if (mode === "gradient") {
    const from = safeColor(settings["products.gradientFrom"], "#e7f6ff");
    const to = safeColor(settings["products.gradientTo"], "#ffffff");
    return {
      mode,
      style: { backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` },
      overlayClassName: "bg-white/25"
    };
  }

  if (mode === "image") {
    const imageUrl = safeBackgroundUrl(settings["products.backgroundImage"]);
    if (!imageUrl) return { mode: "default" };

    return {
      mode,
      style: {
        backgroundImage: `url("${imageUrl}")`,
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      },
      overlayClassName: "bg-white/80 backdrop-blur-[1px]"
    };
  }

  return { mode: "default" };
}
