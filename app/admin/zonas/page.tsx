import { AdminShell } from "@/components/admin/admin-shell";
import { deleteZoneAction, upsertZoneAction } from "../actions";
import { getAllZones } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminZonesPage() {
  await requireAdmin();
  const zones = await getAllZones();

  return (
    <AdminShell title="Zonas" description="ABM simple de cobertura de distribución.">
      <div className="grid gap-6">
        <form action={upsertZoneAction} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Nueva zona</h2>
          <input name="name" placeholder="Nombre" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <textarea name="description" placeholder="Descripción" className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked />
            Activa
          </label>
          <button className="w-fit rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">Guardar zona</button>
        </form>
        {zones.map((zone) => (
          <div key={zone.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <form action={upsertZoneAction} className="grid gap-4">
              <input type="hidden" name="id" value={zone.id} />
              <input name="name" defaultValue={zone.name} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <textarea name="description" defaultValue={zone.description} className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isActive" defaultChecked={zone.isActive} />
                Activa
              </label>
              <button className="w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Actualizar</button>
            </form>
            <form action={deleteZoneAction} className="mt-3">
              <input type="hidden" name="id" value={zone.id} />
              <button className="text-sm font-semibold text-rose-600">Eliminar</button>
            </form>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
