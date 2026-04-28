import { PublicShell } from "@/components/site/public-shell";
import { SalePointsMap } from "@/components/site/sale-points-map";
import { getActiveSalePoints } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Puntos de venta",
  description: "Mapa simple y listado de puntos de venta activos."
});

export default async function SalePointsPage() {
  const points = await getActiveSalePoints();

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-700">Puntos de venta</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Dónde encontrarnos</h1>
        </div>
        <div className="mt-10">
          <SalePointsMap points={points} />
        </div>
      </main>
    </PublicShell>
  );
}
