"use client";

import { useState } from "react";
import { Maximize2, X } from "lucide-react";

type ProductImageViewerProps = {
  src: string;
  alt: string;
};

export function ProductImageViewer({ src, alt }: ProductImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block w-full overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card"
        aria-label={`Ampliar imagen de ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-[460px] lg:h-[540px]"
        />
        <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition group-hover:bg-slate-950">
          Ampliar
          <Maximize2 className="h-4 w-4" />
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen ampliada de ${alt}`}
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-card transition hover:scale-105"
            aria-label="Cerrar imagen ampliada"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-h-[86vh] w-full max-w-5xl rounded-[1.5rem] object-contain shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
