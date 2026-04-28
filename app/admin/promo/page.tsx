import { AdminShell } from "@/components/admin/admin-shell";
import { upsertPromoCodeAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { getPromoCodes, getPromoDashboardSummary } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPromoPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const [summary, promoCodes] = await Promise.all([
    getPromoDashboardSummary(),
    getPromoCodes(params.q)
  ]);

  return (
    <AdminShell title="Promo" description="Control de códigos, premios y reclamos de la campaña QR.">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: summary.total },
          { label: "Ganadores", value: summary.winners },
          { label: "Reclamados", value: summary.claimed },
          { label: "Pendientes", value: summary.pending }
        ].map((item) => (
          <article key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <form action={upsertPromoCodeAction} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-900">Alta o reset de código</h2>
          <input name="code" placeholder="LH-0005" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <input name="prize" placeholder="no_gana / kit_lavado / camiseta_argentina" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          <button className="w-fit rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">Guardar código</button>
        </form>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <form className="mb-4">
            <input name="q" defaultValue={params.q || ""} placeholder="Buscar por código, nombre o localidad" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="pb-3">Código</th>
                  <th className="pb-3">Premio</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promoCodes.map((code) => (
                  <tr key={code.id}>
                    <td className="py-3 font-semibold text-slate-900">{code.code}</td>
                    <td className="py-3">{code.prize}</td>
                    <td className="py-3">{code.status === "CLAIMED" ? "Usado" : code.prize === "no_gana" ? "Sin premio" : "Disponible"}</td>
                    <td className="py-3">{code.claimantName || "-"}</td>
                    <td className="py-3">{code.claimedAt ? formatDate(code.claimedAt) : "Sin reclamar"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
