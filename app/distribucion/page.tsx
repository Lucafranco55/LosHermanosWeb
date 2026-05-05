import { PublicShell } from "@/components/site/public-shell";
import { getActiveZones } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { Boxes } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Distribución",
  description: "Zonas donde distribuimos y operamos comercialmente."
});

export default async function DistributionPage() {
  const zones = await getActiveZones();

  return (
    <PublicShell>
      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
            <Boxes className="h-4 w-4" />
            Distribución
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Cobertura comercial y logística</h1>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {zones.map((zone) => (
            <article key={zone.id} className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
              <div className="inline-flex rounded-2xl bg-brand-50 p-3">
                <Boxes className="h-5 w-5 text-brand-700" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-slate-900">{zone.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{zone.description}</p>
            </article>
          ))}
        </div>
      </main>
    </PublicShell>
  );
}
