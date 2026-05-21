import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { contentSettingGroups, contentSettingKeys } from "@/lib/content-settings";
import { prisma } from "@/lib/prisma";
import { upsertSiteSettingAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await requireAdmin();
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: contentSettingKeys } },
    orderBy: { key: "asc" }
  });

  return (
    <AdminShell title="Contenido general" description="Ajustes editables del sitio institucional.">
      <div className="grid gap-8">
        {contentSettingGroups.map((group) => (
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
