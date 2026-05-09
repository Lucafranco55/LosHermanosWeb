import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertSiteSettingAction } from "../actions";

export const dynamic = "force-dynamic";

const settingGroups = [
  {
    title: "General",
    settings: [
      { key: "home.heroTitle", label: "Home - titulo principal" },
      { key: "home.heroText", label: "Home - texto principal" },
      { key: "site.tagline", label: "Sitio - bajada general" },
      { key: "contact.whatsapp", label: "Contacto - WhatsApp" },
      { key: "contact.email", label: "Contacto - email" }
    ]
  },
  {
    title: "Calidad",
    settings: [
      { key: "quality.title", label: "Calidad - titulo" },
      { key: "quality.subtitle", label: "Calidad - subtitulo" },
      { key: "quality.ph", label: "Calidad - pH" },
      { key: "quality.tds", label: "Calidad - TDS" },
      { key: "quality.conductivity", label: "Calidad - conductividad" },
      { key: "quality.process", label: "Calidad - proceso" },
      { key: "quality.usage", label: "Calidad - uso recomendado" },
      { key: "quality.pdfUrl", label: "Calidad - link del PDF" }
    ]
  },
  {
    title: "Cobertura",
    settings: [
      { key: "cobertura.title", label: "Cobertura - titulo principal" },
      { key: "cobertura.subtitle", label: "Cobertura - subtitulo" },
      { key: "cobertura.frequencyText", label: "Cobertura - frecuencia de entregas" },
      { key: "cobertura.zones", label: "Cobertura - zonas principales", hint: "Una zona por linea." },
      {
        key: "cobertura.distributors",
        label: "Cobertura - distribuidores",
        hint: "Primera linea: nombre. Lineas siguientes: texto descriptivo."
      },
      { key: "cobertura.distributorWhatsapp", label: "Cobertura - WhatsApp distribuidor" },
      { key: "cobertura.mapText", label: "Cobertura - texto del mapa" }
    ]
  }
];

const editableSettings = settingGroups.flatMap((group) => group.settings);
const editableKeys = editableSettings.map((item) => item.key);

export default async function AdminContentPage() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: editableKeys } },
    orderBy: { key: "asc" }
  });

  return (
    <AdminShell title="Contenido general" description="Ajustes editables del sitio institucional.">
      <div className="grid gap-8">
        {settingGroups.map((group) => (
          <section key={group.title} className="grid gap-4">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">{group.title}</h2>
              <p className="mt-1 text-sm text-slate-500">Campos editables guardados como SiteSetting.</p>
            </div>
            <div className="grid gap-4">
              {group.settings.map((item) => {
                const setting = settings.find((current) => current.key === item.key);
                return (
                  <form key={item.key} action={upsertSiteSettingAction} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <input type="hidden" name="key" value={item.key} />
                    <div>
                      <label className="text-sm font-semibold text-slate-700">{item.label}</label>
                      <p className="mt-1 text-xs text-slate-500">{item.hint || item.key}</p>
                    </div>
                    <textarea name="value" defaultValue={setting?.value || ""} className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                    <button className="w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Guardar</button>
                  </form>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AdminShell>
  );
}
