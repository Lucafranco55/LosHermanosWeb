import { CoverageMap } from "@/components/site/coverage-map";
import { PublicShell } from "@/components/site/public-shell";
import { getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { MapPinned, Route, Truck, Waves, Warehouse } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Cobertura",
  description: "Zonas de cobertura, distribuidores y mapa de localidades Los Hermanos.",
  path: "/cobertura"
});

const defaults = {
  title: "Zonas de cobertura y distribuidores",
  subtitle: "Realizamos entregas programadas y distribución mayorista según zona y demanda.",
  frequencyText: "Realizamos entregas programadas y distribución mayorista según zona y demanda.",
  zones: ["General Belgrano y alrededores", "Zona Oeste", "Zona Sur", "Costa Atlántica", "Ruta 41", "Ruta 29"],
  mapText: "Mapa real de localidades donde organizamos entregas programadas y cobertura comercial."
};

const regionalCards = [
  {
    title: "Zona Oeste",
    text: "Cobertura mayorista para comercios, talleres y estaciones con entregas coordinadas.",
    icon: Warehouse
  },
  {
    title: "Zona Sur",
    text: "Atención programada para puntos de venta y clientes comerciales del corredor sur.",
    icon: Truck
  },
  {
    title: "Costa Atlántica",
    text: "Distribución planificada hacia localidades costeras según demanda y frecuencia.",
    icon: Waves
  }
];

function setting(settings: Record<string, string>, key: string, fallback: string) {
  const value = settings[key]?.trim();
  return value || fallback;
}

function linesFromSetting(settings: Record<string, string>, key: string, fallback: string[]) {
  const value = settings[key]?.trim();
  if (!value) return fallback;
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length ? lines : fallback;
}

export default async function CoveragePage() {
  const settings = await getSiteSettingsMap();
  const title = setting(settings, "cobertura.title", defaults.title);
  const subtitle = setting(settings, "cobertura.subtitle", defaults.subtitle);
  const frequencyText = setting(settings, "cobertura.frequencyText", defaults.frequencyText);
  const coverageZones = linesFromSetting(settings, "cobertura.zones", defaults.zones);
  const mapText = setting(settings, "cobertura.mapText", defaults.mapText);

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
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{subtitle}</p>
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
              <p className="mt-1 text-sm text-slate-600">{frequencyText}</p>
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

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-brand-50 p-3">
              <MapPinned className="h-5 w-5 text-brand-700" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Mapa de cobertura</h2>
              <p className="mt-1 text-sm text-slate-600">{mapText}</p>
            </div>
          </div>
          <CoverageMap />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {regionalCards.map((card) => (
              <article key={card.title} className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
                <div className="inline-flex rounded-2xl bg-brand-50 p-3">
                  <card.icon className="h-5 w-5 text-brand-700" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
