"use client";

import dynamic from "next/dynamic";

const CoverageLeafletMap = dynamic(
  () => import("./coverage-leaflet-map").then((module) => module.CoverageLeafletMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-[2rem] border border-brand-100 bg-white text-sm font-semibold text-slate-500 shadow-card sm:h-[500px]">
        Cargando mapa de cobertura...
      </div>
    )
  }
);

export function CoverageMap() {
  return <CoverageLeafletMap />;
}
