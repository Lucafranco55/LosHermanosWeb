import { PublicShell } from "@/components/site/public-shell";
import { SalePointsMap } from "@/components/site/sale-points-map";
import { getActiveSalePoints } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { MapPinned, MessageCircle, PackageCheck, Route, Truck, Warehouse } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Cobertura",
  description: "Zonas de cobertura, distribuidores y mapa de localidades Los Hermanos.",
  path: "/cobertura"
});

const coverageZones = [
  "General Belgrano y alrededores",
  "Zona Oeste",
  "Zona Sur",
  "Costa Atlántica",
  "Ruta 41",
  "Ruta 29"
];

const distributorWhatsappUrl =
  "https://wa.me/5490000000000?text=Hola,%20quiero%20consultar%20por%20productos%20en%20Zona%20Sur";

export default async function CoveragePage() {
  const points = await getActiveSalePoints();

  return (
    <PublicShell>
      <main>
        <section className="border-b border-brand-100 bg-[linear-gradient(180deg,#f8fcff_0%,#eef8ff_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
                <MapPinned className="h-4 w-4" />
                Cobertura
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Zonas de cobertura y distribuidores
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                Realizamos entregas programadas y distribución mayorista según zona y demanda.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3">
              <Route className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Zonas de cobertura</h2>
              <p className="mt-1 text-sm text-slate-600">
                Realizamos entregas programadas y distribución mayorista según zona y demanda.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {coverageZones.map((zone) => (
              <span
                key={zone}
                className="rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {zone}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3">
              <Warehouse className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Distribuidores</h2>
              <p className="mt-1 text-sm text-slate-600">Red de atención para mejorar disponibilidad por zona.</p>
            </div>
          </div>
          <article className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex rounded-2xl bg-brand-50 p-3">
                  <Truck className="h-5 w-5 text-brand-700" />
                </div>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">Distribuidor Zona Sur</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Contamos con distribuidor en Zona Sur para mejorar la atención y disponibilidad de productos.
                </p>
              </div>
              <a
                href={distributorWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800"
              >
                Contactar distribuidor
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Zona</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Zona Sur</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Contacto</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">A definir</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">WhatsApp</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">A definir</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-brand-700" />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Productos disponibles</p>
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                  Agua desmineralizada, lavaparabrisas y productos automotores
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3">
              <MapPinned className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Mapa de localidades</h2>
              <p className="mt-1 text-sm text-slate-600">Puntos activos y referencias de cobertura territorial.</p>
            </div>
          </div>
          <SalePointsMap points={points} />
        </section>
      </main>
    </PublicShell>
  );
}
