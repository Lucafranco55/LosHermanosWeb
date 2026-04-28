import { AdminShell } from "@/components/admin/admin-shell";
import { deleteSalePointAction, upsertSalePointAction } from "../actions";
import { getAllSalePoints } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSalePointsPage() {
  await requireAdmin();
  const points = await getAllSalePoints();

  return (
    <AdminShell title="Puntos de venta" description="CRUD para ubicaciones visibles en el mapa público.">
      <div className="grid gap-6">
        <form action={upsertSalePointAction} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Nuevo punto de venta</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" placeholder="Nombre" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="city" placeholder="Localidad" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="address" placeholder="Dirección" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
            <input name="phone" placeholder="Teléfono" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="latitude" type="number" step="0.000001" placeholder="Latitud" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <input name="longitude" type="number" step="0.000001" placeholder="Longitud" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked />
            Activo
          </label>
          <button className="w-fit rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">Guardar punto</button>
        </form>
        {points.map((point) => (
          <div key={point.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <form action={upsertSalePointAction} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="id" value={point.id} />
              <input name="name" defaultValue={point.name} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="city" defaultValue={point.city} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="address" defaultValue={point.address} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm md:col-span-2" />
              <input name="phone" defaultValue={point.phone || ""} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="latitude" type="number" step="0.000001" defaultValue={point.latitude} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <input name="longitude" type="number" step="0.000001" defaultValue={point.longitude} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" name="isActive" defaultChecked={point.isActive} />
                  Activo
                </label>
              </div>
              <button className="w-fit rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Actualizar</button>
            </form>
            <form action={deleteSalePointAction} className="mt-3">
              <input type="hidden" name="id" value={point.id} />
              <button className="text-sm font-semibold text-rose-600">Eliminar</button>
            </form>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
