import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getDashboardSummary, getPromoDashboardSummary } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [summary, promo, admin] = await Promise.all([
    getDashboardSummary(),
    getPromoDashboardSummary(),
    requireAdmin()
  ]);

  return (
    <AdminShell
      title={`Dashboard${admin ? ` · ${admin.name}` : ""}`}
      description="Resumen operativo del sitio, formularios y campaña promocional."
    >
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Productos", value: summary.products },
          { label: "Zonas", value: summary.zones },
          { label: "Puntos de venta", value: summary.salePoints },
          { label: "Consultas", value: summary.leads },
          { label: "Códigos promo", value: summary.promoCodes },
          { label: "Premios reclamados", value: promo.claimed }
        ].map((item) => (
          <article key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { href: "/admin/productos", title: "Gestionar productos", text: "Altas, edición y visibilidad del catálogo." },
          { href: "/admin/consultas", title: "Revisar consultas", text: "Formularios públicos y estado comercial." },
          { href: "/admin/promo", title: "Controlar promo", text: "Códigos, premios y reclamos." }
        ].map((card) => (
          <Link key={card.href} href={card.href} className="rounded-[1.75rem] border border-brand-100 bg-white p-6 shadow-card">
            <h2 className="text-xl font-bold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
