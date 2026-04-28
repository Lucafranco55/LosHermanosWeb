import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/zonas", label: "Zonas" },
  { href: "/admin/puntos-de-venta", label: "Puntos de venta" },
  { href: "/admin/consultas", label: "Consultas" },
  { href: "/admin/promo", label: "Promo" },
  { href: "/admin/contenido", label: "Contenido" }
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
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-[2rem] bg-brand-900 p-6 text-white shadow-card lg:sticky lg:top-6 lg:w-72 lg:self-start">
          <Link href="/" className="text-lg font-black uppercase tracking-[0.2em] text-brand-100">
            Los Hermanos
          </Link>
          <p className="mt-2 text-sm text-brand-100/80">Panel interno</p>
          <nav className="mt-6 grid gap-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl px-3 py-2 hover:bg-white/10">
                {item.label}
              </Link>
            ))}
          </nav>
          <form action="/admin/logout" method="POST" className="mt-6">
            <button className="w-full rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold">
              Cerrar sesión
            </button>
          </form>
        </aside>
        <main className="min-w-0 flex-1 rounded-[2rem] bg-white p-6 shadow-card sm:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
