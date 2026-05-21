import { PublicShell } from "@/components/site/public-shell";
import { safeContentUrl, settingValue } from "@/lib/content-settings";
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

export default async function QualityPage() {
  const settings = await getSiteSettingsMap();
  const pdfUrl = safeContentUrl(settings["quality.pdfUrl"], "/analisis-laboratorio.pdf");
  const qualityContent = {
    badge: settingValue(settings, "quality.badge", "Calidad"),
    title: settingValue(settings, "quality.title", "Calidad"),
    subtitle: settingValue(settings, "quality.subtitle"),
    pdfLabel: settingValue(settings, "quality.pdfLabel", "Ver PDF")
  };

  const technicalData = [
    {
      label: settingValue(settings, "quality.phLabel", "pH"),
      value: settingValue(settings, "quality.ph"),
      icon: Activity
    },
    {
      label: settingValue(settings, "quality.tdsLabel", "TDS"),
      value: settingValue(settings, "quality.tds"),
      icon: Droplets
    },
    {
      label: settingValue(settings, "quality.conductivityLabel", "Conductividad"),
      value: settingValue(settings, "quality.conductivity"),
      icon: Gauge
    },
    {
      label: settingValue(settings, "quality.processLabel", "Proceso"),
      value: settingValue(settings, "quality.process"),
      icon: FlaskConical
    },
    {
      label: settingValue(settings, "quality.usageLabel", "Uso"),
      value: settingValue(settings, "quality.usage"),
      icon: Factory
    }
  ].filter((item) => item.label || item.value);

  return (
    <PublicShell>
      <main>
        <section className="border-b border-brand-100 bg-[linear-gradient(180deg,#f8fcff_0%,#eef8ff_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                {qualityContent.badge}
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                {qualityContent.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                {qualityContent.subtitle}
              </p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800"
              >
                {qualityContent.pdfLabel}
                <FileText className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {technicalData.length ? (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {technicalData.map((item) => (
                <article key={item.label || item.value} className="rounded-[2rem] border border-brand-100 bg-white p-6 shadow-card">
                  <div className="inline-flex rounded-2xl bg-brand-50 p-3">
                    <item.icon className="h-5 w-5 text-brand-700" />
                  </div>
                  {item.label ? <h2 className="mt-4 text-xl font-bold text-slate-900">{item.label}</h2> : null}
                  {item.value ? <p className="mt-3 text-sm leading-7 text-slate-600">{item.value}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </PublicShell>
  );
}
