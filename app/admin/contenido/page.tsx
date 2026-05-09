import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertSiteSettingAction } from "../actions";

export const dynamic = "force-dynamic";

const editableSettings = [
  { key: "home.heroTitle", label: "Home - titulo principal" },
  { key: "home.heroText", label: "Home - texto principal" },
  { key: "site.tagline", label: "Sitio - bajada general" },
  { key: "contact.whatsapp", label: "Contacto - WhatsApp" },
  { key: "contact.email", label: "Contacto - email" },
  { key: "quality.title", label: "Calidad - titulo" },
  { key: "quality.subtitle", label: "Calidad - subtitulo" },
  { key: "quality.ph", label: "Calidad - pH" },
  { key: "quality.tds", label: "Calidad - TDS" },
  { key: "quality.conductivity", label: "Calidad - conductividad" },
  { key: "quality.process", label: "Calidad - proceso" },
  { key: "quality.usage", label: "Calidad - uso recomendado" },
  { key: "quality.pdfUrl", label: "Calidad - link del PDF" }
];

const editableKeys = editableSettings.map((item) => item.key);

export default async function AdminContentPage() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: editableKeys } },
    orderBy: { key: "asc" }
  });

  return (
    <AdminShell title="Contenido general" description="Ajustes editables del sitio institucional.">
      <div className="grid gap-4">
        {editableSettings.map((item) => {
          const setting = settings.find((current) => current.key === item.key);
          return (
            <form key={item.key} action={upsertSiteSettingAction} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <input type="hidden" name="key" value={item.key} />
              <div>
                <label className="text-sm font-semibold text-slate-700">{item.label}</label>
                <p className="mt-1 text-xs text-slate-500">{item.key}</p>
              </div>
              <textarea name="value" defaultValue={setting?.value || ""} className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <button className="w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Guardar</button>
            </form>
          );
        })}
      </div>
    </AdminShell>
  );
}
