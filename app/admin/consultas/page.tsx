import { LeadStatus } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { updateLeadStatusAction } from "../actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await prisma.contactLead.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell title="Consultas" description="Listado de formularios públicos con cambio de estado.">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Mensaje</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-4">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-4">
                  <span
                    className={
                      lead.leadType === "RESELLER"
                        ? "inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
                        : "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                    }
                  >
                    {lead.leadType === "RESELLER" ? "Cliente / distribuidor" : "Consulta general"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{lead.name}</p>
                  <p className="text-slate-500">{lead.business || "-"}</p>
                </td>
                <td className="px-4 py-4">
                  <p>{lead.phone}</p>
                  <p className="text-slate-500">{lead.city}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">{lead.message}</td>
                <td className="px-4 py-4">
                  <form action={updateLeadStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={lead.id} />
                    <select name="status" defaultValue={lead.status} className="rounded-xl border border-slate-200 px-3 py-2">
                      {Object.values(LeadStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-xl bg-slate-900 px-3 py-2 font-semibold text-white">Guardar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
