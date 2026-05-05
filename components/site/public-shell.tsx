import { Boxes, Contact, Gift, type LucideIcon, MapPinned, PackageSearch } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { BrandLogo } from "./brand-logo";

const navItems: Array<{ href: string; label: string; icon?: LucideIcon }> = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos", icon: PackageSearch },
  { href: "/distribucion", label: "Distribución", icon: Boxes },
  { href: "/puntos-de-venta", label: "Puntos de venta", icon: MapPinned },
  { href: "/contacto", label: "Contacto", icon: Contact },
  { href: "/promo", label: "Promo", icon: Gift }
];

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fcff_0%,#f5f9fc_48%,#ffffff_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <BrandLogo showTagline imageClassName="h-11 w-auto object-contain" />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-brand-700">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contacto"
            className="rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-800"
          >
            Consultar
          </Link>
        </div>
        <div className="border-t border-brand-100 md:hidden">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 text-sm font-semibold text-slate-700 sm:px-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-100 px-3 py-2 shadow-sm"
              >
                {item.icon ? <item.icon className="h-4 w-4 text-brand-700" /> : null}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-brand-100 bg-slate-950 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-4">
            <BrandLogo
              className="items-start"
              imageClassName="h-12 w-auto rounded-md bg-white/95 p-1 object-contain"
              textClassName="text-white"
            />
            <div>
              <p className="text-base font-semibold text-white">Producción y distribución</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Soluciones comerciales para productos, distribución territorial, puntos de venta y campañas promocionales.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:justify-self-end">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-200">Links</p>
            <div className="flex flex-wrap gap-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
