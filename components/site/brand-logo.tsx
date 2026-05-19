"use client";

import Link from "next/link";
import { useState } from "react";

type BrandLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  fallbackText?: string;
  tagline?: string;
  showTagline?: boolean;
};

export function BrandLogo({
  href = "/",
  className = "",
  imageClassName = "",
  textClassName = "",
  fallbackText = "Los Hermanos",
  tagline = "Producción y distribución",
  showTagline = false
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      {!imageError ? (
        <img
          src="/logo-los-hermanos.png"
          alt={fallbackText}
          className={imageClassName || "h-11 w-auto object-contain"}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`font-black uppercase tracking-[0.22em] text-brand-800 ${textClassName}`}>
          {fallbackText}
        </span>
      )}
      {showTagline ? (
        <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:inline-flex">
          {tagline}
        </span>
      ) : null}
    </Link>
  );
}
