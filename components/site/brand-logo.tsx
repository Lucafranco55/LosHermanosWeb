"use client";

import { useState } from "react";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
};

export function BrandLogo({
  href = "/",
  className = "",
  imageClassName = "",
  textClassName = "",
  showTagline = false
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={href} className={`inline-flex items-center gap-3 ${className}`}>
      {!imageError ? (
        <img
          src="/logo-los-hermanos.png"
          alt="Los Hermanos"
          className={imageClassName || "h-11 w-auto object-contain"}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={`font-black uppercase tracking-[0.22em] text-brand-800 ${textClassName}`}>
          LOS HERMANOS
        </span>
      )}
      {showTagline ? (
        <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:inline-flex">
          Producción y distribución
        </span>
      ) : null}
    </Link>
  );
}
