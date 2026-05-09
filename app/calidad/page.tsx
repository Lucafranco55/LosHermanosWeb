import { PublicShell } from "@/components/site/public-shell";
import { getSiteSettingsMap } from "@/lib/queries";
import { buildMetadata } from "@/lib/site";
import { Activity, Droplets, Factory, FileText, FlaskConical, Gauge, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Calidad",
  description:
    "Calidad y analisis del agua desmineralizada Los Hermanos para uso automotor e industrial.",
  path: "/calidad"
});

const defaults = {
  title: "Calidad y análisis",
  subtitle:
    "Controlamos la pureza de nuestra agua desmineralizada para garantizar un producto confiable para uso automotor e industrial.",
  ph: "pH controlado para mantener estabilidad en aplicaciones automotrices e industriales.",
  tds: "TDS reducido, con bajo nivel de solidos disueltos.",
  conductivity: "Conductividad controlada para verificar la desmineralizacion del agua.",
  process: "Proceso por osmosis inversa para reducir sales, minerales e impurezas.",
  usage: "Uso recomendado en baterias, radiadores, talleres, estaciones de servicio y procesos industriales.",
  pdfUrl: "/analisis-laboratorio.pdf"
};

function safePdfUrl(value: string | undefined) {
  if (!value) return defaults.pdfUrl;
  if (value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://")) return value;
  return defaults.pdfUrl;
}

export default async function QualityPage() {
  const settings = await getSiteSettingsMap();
  const title = settings["quality.title"] || defaults.title;
  const subtitle = settings["quality.subtitle"] || defaults.subtitle;
  const pdfUrl = safePdfUrl(settings["quality.pdfUrl"]);

  const technicalData = [
    { label: "pH", value: settings["quality.ph"] || defaults.ph, icon: Activity },
    { label: "TDS", value: settings["quality.tds"] || defaults.tds, icon: Droplets },
    {
      label: "Conductividad",
      value: settings["quality.conductivity"] || defaults.conductivity,
      icon: Gauge
    },
    {
      label: "Proceso por ósmosis inversa",
      value: settings["quality.process"] || defaults.process,
      icon: FlaskConical
    },
    {
      label: "Uso automotor e industrial",
      value: settings["quality.usage"] || defaults.usage,
      icon: Factory
    }
  ];

  return (
    <PublicShell>
      <main>
        <section className="border-b border-brand-100 bg-[linear-gradient(180deg,#f8fcff_0%,#eef8ff_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Calidad
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">{subtitle}</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800"
              >
                Ver análisis de laboratorio
                <FileText className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {technicalData.map((item) => (
              <article key={item.label} className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
                <div className="inline-flex rounded-2xl bg-brand-50 p-3">
                  <item.icon className="h-5 w-5 text-brand-700" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">{item.label}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.value}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
