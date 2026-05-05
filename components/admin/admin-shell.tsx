import { LayoutDashboard, ListChecks, type LucideIcon, MapPinned, PackageSearch, Settings2, Ticket } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { BrandLogo } from "../site/brand-logo";

const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: PackageSearch },
  { href: "/admin/zonas", label: "Zonas", icon: MapPinned },
  { href: "/admin/puntos-de-venta", label: "Puntos de venta", icon: MapPinned },
  { href: "/admin/consultas", label: "Consultas", icon: ListChecks },
  { href: "/admin/promo", label: "Promo", icon: Ticket },
  { href: "/admin/contenido", label: "Contenido", icon: Settings2 }
];

export function AdminShell({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#edf7ff_0%,#f8fbfe_48%,#ffffff_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-[2rem] bg-[linear-gradient(180deg,#0c3650_0%,#10283a_100%)] p-6 text-white shadow-card lg:sticky lg:top-6 lg:w-72 lg:self-start">
          <BrandLogo imageClassName="h-11 w-auto rounded-md bg-white p-1 object-contain" textClassName="text-white" />
          <p className="mt-3 text-sm text-brand-100/80">Panel interno</p>
          <nav className="mt-6 grid gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-white/10">
                <item.icon className="h-4 w-4 text-brand-200" />
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/admin/logout" method="POST" className="mt-6">
            <button className="w-full rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold">
              Cerrar sesión
            </button>
          </form>
        </aside>
        <main className="min-w-0 flex-1 rounded-[2rem] border border-white bg-white p-6 shadow-card sm:p-8">
          <div className="mb-8 rounded-[1.75rem] border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-brand-50 p-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
