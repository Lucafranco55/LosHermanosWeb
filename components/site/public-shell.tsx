import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/distribucion", label: "Distribución" },
  { href: "/puntos-de-venta", label: "Puntos de venta" },
  { href: "/contacto", label: "Contacto" },
  { href: "/promo", label: "Promo" }
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-black uppercase tracking-[0.22em] text-brand-800">
            Los Hermanos
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-brand-700">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/contacto" className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
            Consultar
          </Link>
        </div>
        <div className="border-t border-brand-100 md:hidden">
          <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-4 py-3 text-sm font-semibold text-slate-700 sm:px-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-2">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-brand-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 text-sm text-slate-600 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-brand-800">Los Hermanos</p>
            <p>Producción, distribución y soluciones comerciales.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-brand-700">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
