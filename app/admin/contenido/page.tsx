import { AdminShell } from "@/components/admin/admin-shell";
import { upsertSiteSettingAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const editableKeys = [
  "home.heroTitle",
  "home.heroText",
  "site.tagline",
  "contact.whatsapp",
  "contact.email"
];

export default async function AdminContentPage() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: editableKeys } },
    orderBy: { key: "asc" }
  });

  return (
    <AdminShell title="Contenido general" description="Ajustes editables del sitio institucional.">
      <div className="grid gap-4">
        {editableKeys.map((key) => {
          const setting = settings.find((item) => item.key === key);
          return (
            <form key={key} action={upsertSiteSettingAction} className="grid gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <input type="hidden" name="key" value={key} />
              <label className="text-sm font-semibold text-slate-700">{key}</label>
              <textarea name="value" defaultValue={setting?.value || ""} className="min-h-24 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <button className="w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Guardar</button>
            </form>
          );
        })}
      </div>
    </AdminShell>
  );
}
